from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS  # Importa CORS
import boto3
import io
from PIL import Image
import cv2
from models import ModelLoading
import numpy as np


app = Flask(__name__)
CORS(app) 
model_loader = ModelLoading()

# Inicializa los clientes de AWS Rekognition y DynamoDB
rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamodb = boto3.client('dynamodb', region_name='us-east-1')

@app.route('/recognize', methods=['POST'])
def recognize_face():
    # Usa OpenCV para capturar una imagen desde la cámara
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return jsonify({"error": "No se puede abrir la cámara"}), 500

    # Captura un solo frame de la cámara
    ret, frame = cap.read()
    if not ret:
        return jsonify({"error": "No se puede capturar una imagen"}), 500

    # Libera la cámara
    cap.release()

    # Convierte el frame capturado (que está en formato BGR) a una imagen PIL en formato RGB
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    # Convierte la imagen en un stream de bytes para enviarla a Rekognition
    stream = io.BytesIO()
    image.save(stream, format="JPEG")
    image_binary = stream.getvalue()

    # Llama a Rekognition para buscar caras en la imagen
    try:
        response = rekognition.search_faces_by_image(
            CollectionId='projectAI',
            Image={'Bytes': image_binary}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Procesa la respuesta de Rekognition
    found = False
    person_name = None
    for match in response['FaceMatches']:
        face_id = match['Face']['FaceId']
        confidence = match['Face']['Confidence']

        # Busca información en DynamoDB con el FaceId
        face = dynamodb.get_item(
            TableName='face_recognition',
            Key={'RekognitionId': {'S': face_id}}
        )

        if 'Item' in face:
            person_name = face['Item']['FullName']['S']
            found = True

    if found:
        return jsonify({"message": "Hola", "name": person_name})
    else:
        return jsonify({"message": "Person cannot be recognized"})
    

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


if __name__ == '__main__':
    app.run(debug=True)
