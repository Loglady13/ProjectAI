from datetime import datetime, time, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
import boto3
import io
from PIL import Image
import cv2
import keras
from models import ModelLoading
import numpy as np
import logging
import divisor_video
import procesar_video
import analizador_video
import os
from tensorflow.keras.applications.vgg16 import preprocess_input
from PIL import Image
import tensorflow as tf
import wave
import uuid
import tempfile
import librosa
import numpy as np



app = Flask(__name__)
CORS(app) 
model_loader = ModelLoading()
UPLOAD_FOLDER = 'uploads'  # Carpeta donde se almacenan los videos subidos temporalmente
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Asegúrate de que la carpeta para subir videos exista
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configuración de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def process_uploaded_video(video_path):
    try:
        # Se va a ir indicando en qué parte del proceso se encuentra el video
        logging.info("Dividiendo video subido...")
        divided_videos = divisor_video.split_video(video_path, 4)

        logging.info("Procesando videos divididos...")
        results_dict = procesar_video.process_videos_with_threading(divided_videos, 'reporte1')

        logging.info("Analizando resultados...")
        analysis_results = analizador_video.plot_class_and_general_stats(results_dict)
        return analysis_results

    except Exception as e:
        logging.error(f"Error en el procesamiento de videos: {e}")
        return {"error": str(e)}

@app.route('/process_videos', methods=['POST'])
def analizador_videos():
    # Verifica si se incluyó un archivo en la solicitud
    if 'video' not in request.files:
        return jsonify({"error": "No se proporcionó un archivo de video"}), 400

    video = request.files['video']
    if video.filename == '':
        return jsonify({"error": "No se seleccionó ningún archivo"}), 400

    # Asegúrate de que el archivo tiene un nombre seguro
    
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video.filename)

    # Guarda el archivo subido en el servidor
    video.save(video_path)

    # Procesa el video subido
    analysis_results = process_uploaded_video(video_path)

    # Elimina el archivo después de procesarlo si no necesitas almacenarlo
    os.remove(video_path)

    return jsonify(analysis_results)
# Inicializa los clientes de AWS Rekognition y DynamoDB
rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamodb = boto3.client('dynamodb', region_name='us-east-1')

def capturar_y_preprocesar_imagen(img_size=(299, 299)):

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: No se puede abrir la cámara")
        return None
    
    while True:
        ret, frame = cap.read()

        if not ret:
            print("Error: No se pudo leer la imagen")
        break
    
    cap.release()
    cv2.destroyAllWindows()

    # Preprocesamiento directo desde el fotograma capturado
    print("Preprocesando la imagen...")
    img = cv2.resize(frame, img_size)  # Redimensiona la imagen
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  # Convierte a RGB
    img = img / 255.0  # Escala los valores entre 0 y 1
    img = np.expand_dims(img, axis=0)  # Añade una dimensión para el modelo

    return img

def predecir_imagen(modelo_path, img_preprocesada):
    print("Cargando modelo")
    modelo = tf.keras.models.load_model(modelo_path)
    # Imprime el tamaño esperado de entrada
    print("Tamaño de entrada esperado por el modelo:", modelo.input_shape)

    print("Realizando predicción")
    predicciones = modelo.predict(img_preprocesada)
    clases = ["Kristel", "Leandro", "Raschell"]
    clase_predicha = clases[np.argmax(predicciones)]
    print(f"La clase predicha es: {clase_predicha}")

    return clase_predicha

@app.route('/recognize', methods=['POST'])
def recognize():
    img_preprocesada = capturar_y_preprocesar_imagen(img_size=(299, 299))

    if img_preprocesada is not None:
        ruta_modelo = '../deep_learning_models/reconocimiento_facial.keras'
        prediccion = predecir_imagen(ruta_modelo, img_preprocesada)

        # Crear un diccionario con la predicción
        resultado = {"prediccion": prediccion}

        # Convertir el diccionario a JSON y devolverlo como respuesta
        return jsonify(resultado), 200

    else:
        # Si no se pudo procesar la imagen, devolver un error
        return jsonify({"error": "No se pudo capturar la imagen"}), 400



def preprocess_audio(file_path, target_length, fft_length):
    # Cargar audio
    audio, sr = librosa.load(file_path, sr=None)
    
    # Extraer espectrograma o MFCC (elige el que usaste)
    spectrogram = librosa.feature.melspectrogram(y=audio, sr=sr, n_fft=fft_length, hop_length=512)
    log_spectrogram = librosa.power_to_db(spectrogram, ref=np.max)
    
    # Asegurar la longitud
    if log_spectrogram.shape[1] < target_length:
        # Padding si es más corto
        pad_width = target_length - log_spectrogram.shape[1]
        log_spectrogram = np.pad(log_spectrogram, ((0, 0), (0, pad_width)), mode='constant')
    else:
        # Recortar si es más largo
        log_spectrogram = log_spectrogram[:, :target_length]
    
    # Escalar valores
    log_spectrogram = log_spectrogram / np.max(np.abs(log_spectrogram))
    
    return np.expand_dims(log_spectrogram, axis=-1)  # Expandir dimensiones para el modelo


def CTCLoss(y_true, y_pred):
    logit_length = tf.fill([tf.shape(y_pred)[0]], tf.shape(y_pred)[1])
    label_length = tf.math.count_nonzero(y_true, axis=1)

    loss = tf.nn.ctc_loss(
        labels=y_true,
        logits=y_pred,
        label_length=label_length,
        logit_length=logit_length,
        blank_index=-1,
        logits_time_major=False
    )
    return tf.reduce_mean(loss)

# Registrar la función personalizada
tf.keras.utils.get_custom_objects()["CTCLoss"] = CTCLoss

# The set of characters accepted in the transcription.
characters = [x for x in "abcdefghijklmnñopqrstuvwxyz'?! áéíóú"]

# Mapping characters to integers
char_to_num = keras.layers.StringLookup(vocabulary=characters, oov_token="")

# Mapping integers back to original characters
num_to_char = keras.layers.StringLookup(
    vocabulary=char_to_num.get_vocabulary(), oov_token="", invert=True
)

def decode_predictions(predictions):
    # Implementar tu lógica de decodificación aquí
    # Ejemplo para greedy decoding
    decoded_sequence = np.argmax(predictions, axis=-1)
    decoded_text = ''.join([num_to_char[index] for index in decoded_sequence if index != ""])
    return decoded_text

#  Ruta para procesar audio
# Ruta para procesar audio
@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    model = tf.keras.models.load_model('../deep_learning_models/speech_to_text_spanish.keras')
    audio_file = request.files['audio']

    # Crear directorio 'audios' si no existe
    os.makedirs('audios', exist_ok=True)
        
    # Generar un nombre único para el archivo
    temp_filename = os.path.join('audios', f"{uuid.uuid4().hex}.wav")
        
    # Guardar el archivo temporalmente
    audio_file.save(temp_filename)
    
    # Ruta al nuevo audio
    new_audio_path = temp_filename

    # Preprocesar el audio
    processed_audio = preprocess_audio(new_audio_path, target_length=128, fft_length=512)

    # Agregar dimensión batch (si es necesario)
    input_data = np.expand_dims(processed_audio, axis=0)

    # Realizar predicción
    predictions = model.predict(input_data)

    # Decodificar la salida (por ejemplo, CTC si usaste CTC Loss)
    decoded_text = decode_predictions(predictions)
    print(f'Transcripción: {decoded_text}')
    if 'audio' not in request.files:
        return jsonify({"error": "No se proporcionó archivo de audio"}), 400


def decode_batch_predictions(predictions):
    # Implementa tu decodificación aquí. Ejemplo:
    batch_texts = []
    for prediction in predictions:
        text = ''.join([chr(char) for char in np.argmax(prediction, axis=-1)])
        batch_texts.append(text)
    return batch_texts

@app.route('/aguacate_prediction', methods=['GET'])
def aguacate_prediction():
    try:
        # Obtener los parámetros desde la solicitud
        total_volume = request.args.get('Total_Volume')
        year = request.args.get('year')
        month = request.args.get('Month')
        day = request.args.get('Day')
        region = request.args.get('region')

        # Verificar que todos los parámetros estén presentes
        if total_volume is None or year is None or month is None or day is None or region is None:
            return jsonify({"error": "Missing parameters"}), 400

        # Convertir los valores a los tipos apropiados
        total_volume = float(total_volume)
        year = int(year)
        month = int(month)
        day = int(day)
        region = str(region)

        # Realizar la predicción utilizando el modelo cargado
        predicted_price = model_loader.modelo_aguacate(total_volume, year, month, day, region)

        # Si no se puede hacer la predicción, retornar un mensaje de error
        if predicted_price is None:
            return jsonify({"error": "Prediction failed"}), 500

        # Retornar la predicción en formato JSON
        return jsonify(prediction=predicted_price)
    
    except ValueError as ve:
        return jsonify({"error": f"Invalid input values: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/wine_prediction', methods=['GET'])
def wine_prediction():
    try:
        volatile_acidity = request.args.get('volatile_acidity')
        density = request.args.get('density')
        alcohol = request.args.get('alcohol')

        # Imprime los valores recibidos para depuración
        print(f"Received volatile_acidity: {volatile_acidity}, density: {density}, alcohol: {alcohol}")

        # Asegúrate de que los parámetros no sean None antes de convertirlos a float
        if volatile_acidity is None or density is None or alcohol is None:
            return jsonify({"error": "Missing parameters"}), 400

        # Convertir los valores a float
        volatile_acidity = float(volatile_acidity)
        density = float(density)
        alcohol = float(alcohol)

        # Realizar la predicción
        prediction = model_loader.modelo_vino(volatile_acidity, density, alcohol)
        return jsonify(prediction=prediction)
    except ValueError as ve:
        return jsonify({"error": f"Invalid input values: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/cars_prediction', methods=['GET'])
def cars_prediction():
    try:
        year = request.args.get('year')
        presentPrice = request.args.get('presentPrice')
        kms_driven = request.args.get('kms_driven')
        fuel_type = request.args.get('fuel_type')
        seller_type = request.args.get('seller_type')
        transmission = request.args.get('transmission')
        owner = request.args.get('owner')

        print(f"Recieved year:{year}, present price:{presentPrice}, kms driven:{kms_driven}, fuel type:{fuel_type}, seller type:{seller_type}, transmission: {transmission}, owner: {owner}")

        if year is None or presentPrice is None or kms_driven is None or fuel_type is None or seller_type is None or transmission is None or owner is None:
            return jsonify({"error": "Missing parameters"}), 400
        
        year = int(year)
        presentPrice = float(presentPrice)
        kms_driven = int(kms_driven)
        fuel_type = int(fuel_type)
        seller_type = int(seller_type)
        transmission = int(transmission)
        owner = int(owner)

        predicted_price = model_loader.modelo_autos(year, presentPrice, kms_driven, fuel_type, seller_type, transmission, owner)
        
        if predicted_price is None:
            return jsonify({"error": "Prediction failed"}), 500

        # Retornar la predicción en formato JSON
        return jsonify(prediction=predicted_price)
    except ValueError as ve:
        return jsonify({"error": f"Invalid input values: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/hepatitis_prediction', methods=['GET'])
def hepatitis_prediction():
    try:
        # Obtener parámetros
        params = {
            'alb': request.args.get('alb'),
            'alp': request.args.get('alp'),
            'alt': request.args.get('alt'),
            'ast': request.args.get('ast'),
            'bil': request.args.get('bil'),
            'che': request.args.get('che'),
            'chol': request.args.get('chol'),
            'crea': request.args.get('crea'),
            'ggt': request.args.get('ggt'),
            'prot': request.args.get('prot')
        }

        # Imprimir los valores recibidos
        print(f"Received parameters: {params}")

        # Verificar si falta algún parámetro
        for key, value in params.items():
            if value is None:
                return jsonify({"error": f"Missing parameter: {key}"}), 400
        
        # Convertir los parámetros a float
        try:
            params = {key: float(value) for key, value in params.items()}
        except ValueError as ve:
            return jsonify({"error": f"Invalid input values: {ve}"}), 400

        # Realizar la predicción
        prediction = model_loader.modelo_hepatitis(**params)
        if prediction is None:
            return jsonify({"error": "Prediction failed"}), 500
        if prediction == 0:
            prediction = 'Blood Doner'
        else:
            if prediction == 1:
                prediction = 'Hepatitis'
            else:
                if prediction == 2:
                    prediction = 'Fibrosis'
                else:
                    if prediction == 3: 
                        prediction = 'Cirrhosis'
                    else:
                        if prediction == 4:
                            prediction = 'Very bad cirrhosis'
        # Retornar la predicción en formato JSON
        return jsonify(prediction=prediction)

    except Exception as e:
        # Manejo de excepciones generales
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

@app.route('/bitcoin_prediction', methods=['GET'])
def bitcoin_prediction():
    try:
        # Obtener los parámetros desde la solicitud
        date_str = request.args.get('date')

        # Verificar que todos los parámetros estén presentes
        if date_str is None:
            return jsonify({"error": "Missing parameters"}), 400

        # Convertir la cadena de fecha a un objeto datetime
        date = datetime.strptime(date_str, '%Y-%m-%d')

        # Realizar la predicción utilizando el modelo cargado
        predicted_price = model_loader.modelo_bitcoin(date)

        # Si no se puede hacer la predicción, retornar un mensaje de error
        if predicted_price is None:
            return jsonify({"error": "Prediction failed"}), 500

        # Retornar la predicción en formato JSON
        return jsonify(prediction=predicted_price)
    
    except ValueError as ve:
        return jsonify({"error": f"Invalid input values: {ve}"}), 400
    except Exception as e:
        print(f"Error occurred: {e}")  # Imprimir error en consola
        return jsonify({"error": str(e)}), 500
    

@app.route('/casa_prediction', methods=['GET'])
def casa_prediction():
    try:
        structuretaxvaluedollarcnt = request.args.get('structuretaxvaluedollarcnt')
        calculatedfinishedsquarefeet = request.args.get('calculatedfinishedsquarefeet')
        lotsizesquarefeet = request.args.get('lotsizesquarefeet')
        bathroomcnt = request.args.get('bathroomcnt')
        bedroomcnt = request.args.get('bedroomcnt')
        yearbuilt = request.args.get('yearbuilt')

        print(f"ValorFiscalDeLaEstructura:{structuretaxvaluedollarcnt}, SuperficiTotalTerminada:{calculatedfinishedsquarefeet}, TamanoDelLoteOTerreno:{lotsizesquarefeet}, NumeroDeBanos:{bathroomcnt}, NumeroDeDormitorios:{bedroomcnt}, AnoDeConstruccionDeLaCasa: {yearbuilt}")

        # Validación de parámetros
        if structuretaxvaluedollarcnt is None or calculatedfinishedsquarefeet is None or lotsizesquarefeet is None or bathroomcnt is None or bedroomcnt is None or yearbuilt is None:
            return jsonify({"error": "Missing parameters"}), 400

        # Convertir a float y manejar posibles errores de conversión
        try:
            structuretaxvaluedollarcnt = float(structuretaxvaluedollarcnt)
            calculatedfinishedsquarefeet = float(calculatedfinishedsquarefeet)
            lotsizesquarefeet = float(lotsizesquarefeet)
            bathroomcnt = float(bathroomcnt)
            bedroomcnt = float(bedroomcnt)
            yearbuilt = float(yearbuilt)
        except ValueError as ve:
            return jsonify({"error": f"Invalid input values: {ve}"}), 400

        # Imprimir los datos que se envían al modelo
        print(f"Input for model prediction: {structuretaxvaluedollarcnt}, {calculatedfinishedsquarefeet}, {lotsizesquarefeet}, {bathroomcnt}, {bedroomcnt}, {yearbuilt}")

        # Realizar la predicción
        predicted_price = model_loader.modelo_precio_casa(structuretaxvaluedollarcnt, calculatedfinishedsquarefeet, lotsizesquarefeet, bathroomcnt, bedroomcnt, yearbuilt)
        
        if predicted_price is None:
            return jsonify({"error": "Prediction failed"}), 500

        # Retornar la predicción en formato JSON
        return jsonify(prediction=predicted_price)
    except Exception as e:
        print(f"Error occurred: {e}")  # Agregar impresión de error
        return jsonify({"error": str(e)}), 500


@app.route('/rossman_prediction', methods=['GET'])
def rossman_prediction():
    try:
        # Obtener los parámetros desde la solicitud
        Store = request.args.get('Store')
        DayOfWeek = request.args.get('DayOfWeek')
        Promo = request.args.get('Promo')
        SchoolHoliday = request.args.get('SchoolHoliday')
        Year = request.args.get('Year')
        Month = request.args.get('Month')
        Day = request.args.get('Day')
        Customers = request.args.get('Customers')

        # Verificar que todos los parámetros estén presentes
        if Store is None or DayOfWeek is None or Promo is None or SchoolHoliday is None or Year is None or Month is None or Day is None or Customers is None:
            return jsonify({"error": "Missing parameters"}), 400

        # Convertir los valores a los tipos apropiados
        Store = int(Store)
        DayOfWeek = int(DayOfWeek)
        Promo = int(Promo)
        SchoolHoliday = int(SchoolHoliday)
        Year = int(Year)
        Month = int(Month)
        Day = int(Day)
        Customers = int(Customers)

        # Realizar la predicción utilizando el modelo cargado
        predicted_price = model_loader.modelo_ventas_rossman(Store, DayOfWeek, Promo, SchoolHoliday, Year, Month, Day, Customers)

        # Si no se puede hacer la predicción, retornar un mensaje de error
        if predicted_price is None:
            return jsonify({"error": "Prediction failed"}), 500

        # Retornar la predicción en formato JSON
        return jsonify(prediction=predicted_price)
    
    except ValueError as ve:
        return jsonify({"error": f"Invalid input values: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/crimes_prediction', methods=['GET'])
def crimes_prediction():
    try:
        # Obtener los parámetros desde la solicitud
        date = request.args.get('date')

        # Verificar que todos los parámetros estén presentes
        if date is None:
            return jsonify({"error": "Missing parameters"}), 400

        # Convertir los valores a los tipos apropiados
        dateToString = str(date)

        # Realizar la predicción utilizando el modelo cargado
        predicted_crimes = model_loader.modelo_crimenes_londres(dateToString)
        
        # Si no se puede hacer la predicción, retornar un mensaje de error
        if predicted_crimes is None:
            return jsonify({"error": "Prediction failed"}), 500

        # Retornar la predicción en formato JSON
        return jsonify(prediction=predicted_crimes)
    
    except ValueError as ve:
        return jsonify({"error": f"Invalid input values: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stroke_prediction', methods=['GET'])
def stroke_prediction():
    try:
        # Obtener los parámetros desde la solicitud
        gender = request.args.get('gender')
        age = request.args.get('age')
        hypertension = request.args.get('hypertension')
        heart_disease = request.args.get('heart_disease')
        ever_married = request.args.get('ever_married')
        work_type = request.args.get('work_type')
        Residence_type = request.args.get('Residence_type')
        avg_glucose_level = request.args.get('avg_glucose_level')
        bmi = request.args.get('bmi')
        smoking_status  = request.args.get('smoking_status')

        # Verificar que todos los parámetros estén presentes
        if any(v is None for v in [gender, age, hypertension, heart_disease, 
                           ever_married, work_type, Residence_type, 
                           avg_glucose_level, bmi, smoking_status]):
            return jsonify({"error": "Missing parameters"}), 400

        # Convertir los valores a los tipos apropiados
        gender = int(gender)
        age = int(age)
        hypertension = int(hypertension)
        heart_disease = int(heart_disease)
        ever_married = int(ever_married)
        work_type = str(work_type)
        Residence_type = str(Residence_type)
        avg_glucose_level = float(avg_glucose_level)
        bmi = float(bmi)
        smoking_status = str(smoking_status)

        # Realizar la predicción utilizando el modelo cargado
        predicted_class = model_loader.modelo_clasificacion_acv(gender, age, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status)

        # Si no se puede hacer la predicción, retornar un mensaje de error
        if predicted_class is None:
            return jsonify({"error": "Prediction failed"}), 500
        predicted_class = int(predicted_class)
        result = "El modelo ha determinado que el paciente "
        if predicted_class == 0:
            result += "NO va a padecer un ACV."
        else:
            result += "VA a padecer un ACV."

        # Retornar la predicción en formato JSON
        return jsonify(prediction=result)
    
    except ValueError as ve:
        return jsonify({"error": f"Invalid input values: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stockValue_prediction', methods=['GET'])
def stockValue_prediction():
    try:
        # Obtener los parámetros desde la solicitud
        date = request.args.get('date')

        # Verificar que todos los parámetros estén presentes
        if date is None:
            return jsonify({"error": "Missing parameters"}), 400

        # Convertir los valores a los tipos apropiados
        dateToString = str(date)

        # Realizar la predicción utilizando el modelo cargado
        predicted_crimes = model_loader.modelo_SP_stockValue(dateToString)
        
        # Si no se puede hacer la predicción, retornar un mensaje de error
        if predicted_crimes is None:
            return jsonify({"error": "Prediction failed"}), 500

        # Retornar la predicción en formato JSON
        return jsonify(prediction=predicted_crimes)
    
    except ValueError as ve:
        return jsonify({"error": f"Invalid input values: {ve}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
