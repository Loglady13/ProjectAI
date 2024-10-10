from datetime import timedelta
import os
import pickle
import pandas as pd
import sklearn
import numpy as np
from sklearn.preprocessing import LabelEncoder

class ModelLoading:
    def __init__(self):
        self.modelos = self.load_models()

    @staticmethod
    def  load_models():
        directory_path = r'.\modelos'

        loaded_models = {}
        for filename in os.listdir(directory_path):
            if filename.endswith('.pkl'):
                model_name = filename.split('.')[0]
                file_path = os.path.join(directory_path, filename)
                with open(file_path, 'rb') as file:
                    loaded_model = pickle.load(file)
                    loaded_models[model_name] = loaded_model
        return loaded_models
    
    def modelo_aguacate(self, total_volume, year, month, day, region):
        try:
            input_data = pd.DataFrame({
                'Total Volume': [total_volume],
                'year': [year],
                'Month': [month],
                'Day': [day],
                'region': [region]
            })
            prediction = self.modelos['aguacate'].predict(input_data)
            # Devolver la predicción
            return prediction[0]  # El precio promedio predicho
        except Exception as e:
            print(f"Error predicting with model 'aguacate': {e}")
            return None
       
    def modelo_vino(self, volatile_acidity, density, alcohol):
        try:
            input_data = pd.DataFrame({
                'volatile acidity': [volatile_acidity],
                'density': [density],
                'alcohol': [alcohol],
            })
            # Make predictions using the trained model
            prediction_encoded = self.modelos['modelo_pred_vinos'].predict(input_data)

            # Define mapping dictionary to map encoded values to original labels
            label_mapping = {0: 'Bad', 1: 'Good', 2: 'Regular'}

            # Get the original label corresponding to the predicted encoded value
            original_label = label_mapping[prediction_encoded[0]]

            return original_label
        except Exception as e:
            print(f"Error predicting with model 'wine': {e}")
            return None
        
    def modelo_autos(self, year, presentPrice, kms_driven, fuel_type, seller_type, transmission,owner):
        try:
            input_data = pd.DataFrame({
                'Year': [year],
                'Present_Price': [presentPrice],
                'Kms_Driven': [kms_driven],
                'Fuel_Type': [fuel_type],
                'Seller_Type': [seller_type],
                'Transmission': [transmission],
                'Owner': [owner]
            })
            prediction = self.modelos['modelo_precio_autos'].predict(input_data)
            # Devolver la predicción
            return prediction[0]  # El precio promedio predicho
        except Exception as e:
            print(f"Error predicting with model 'autos': {e}")
            return None
        
    def modelo_hepatitis(self, alb, alp, alt, ast, bil, che, chol , crea, ggt, prot):
        try:
            
            input_data = pd.DataFrame({
                'ALB': [alb],
                'ALP': [alp],
                'ALT': [alt],
                'AST': [ast],
                'BIL': [bil],
                'CHE': [che],
                'CHOL': [chol],
                'CREA': [crea],
                'GGT': [ggt],
                'PROT': [prot]
            })
            

            prediction = self.modelos['modelo_rf_hepatitis (1)'].predict(input_data)
            return float(prediction[0])
        except Exception as e:
            print(f"Error predicting with model 'hepatitis': {e}")
            return None
        
    def modelo_bitcoin(self, date):
        try:
            # Convertir la fecha a un índice que el modelo pueda entender
            date_index = pd.date_range(start=date - timedelta(days=30), end=date)  # Asumiendo que usas los últimos 30 días para la predicción
        
            # Asegúrate de que el índice esté en el mismo formato que el modelo fue entrenado
            input_data = self.modelos['bitcoin_model'].get_prediction(start=date_index[0], end=date_index[-1], dynamic=False)
            pred_mean = input_data.predicted_mean
        
            # Devuelve el último valor predicho para la fecha solicitada
            return pred_mean.iloc[-1]
        except Exception as e:
            print(f"Error predicting with model 'bitcoin_model': {e}")
            return None    

    def modelo_precio_casa(self, structuretaxvaluedollarcnt, calculatedfinishedsquarefeet, lotsizesquarefeet, bathroomcnt, bedroomcnt, yearbuilt):
        try:
            input_data = pd.DataFrame({
                'structuretaxvaluedollarcnt': [structuretaxvaluedollarcnt],
                'calculatedfinishedsquarefeet': [calculatedfinishedsquarefeet],
                'lotsizesquarefeet': [lotsizesquarefeet],
                'bathroomcnt': [bathroomcnt],
                'bedroomcnt': [bedroomcnt],
                'yearbuilt': [yearbuilt]
            })
            prediction = self.modelos['PrecioCasa_model'].predict(input_data)
            # Devolver la predicción
            return prediction[0]  # El precio promedio predicho
        except Exception as e:
            print(f"Error predicting with model 'Precio casa': {e}")
            return None
        
    def modelo_ventas_rossman(self, Store, DayOfWeek, Promo, SchoolHoliday, Year, Month, Day, Customers):
        try:
            input_data = pd.DataFrame({
                'Store': [Store],
                'DayOfWeek': [DayOfWeek],
                'Promo': [Promo],
                'SchoolHoliday': [SchoolHoliday],
                'Year': [Year],
                'Month': [Month],
                'Day': [Day],
                'Customers': [Customers]
            })
            prediction = self.modelos['VentasRossman'].predict(input_data)
            # Devolver la predicción
            return prediction[0]  # El precio promedio predicho
        except Exception as e:
            print(f"Error predicting with model 'aguacate': {e}")
            return None

    def modelo_crimenes_londres(self, date):
        try:
            date_to_predict = pd.to_datetime(date)
            input_data = pd.DataFrame({
                'value': [0]
            }, index=[date_to_predict])
            prediction = self.modelos['london_crime_model'].predict(start=input_data.index[0], end=input_data.index[0], dynamic=False)
            
            fixedPrediction = round(prediction[0], 2)
            result = f"La predicción es de {fixedPrediction} crímenes aprox. para ese día."
            
            # Devolver la predicción
            return result  # El precio promedio predicho
        except Exception as e:
            print(f"Error predicting with model 'London crimes': {e}")
            return None

    def modelo_clasificacion_acv(self, gender, age, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status):
            try:
                input_data = pd.DataFrame({
                    'gender': [gender],
                    'age': [age],
                    'hypertension': [hypertension],
                    'heart_disease': [heart_disease],
                    'ever_married': [ever_married],
                    'work_type': [work_type],
                    'Residence_type': [Residence_type],
                    'avg_glucose_level': [avg_glucose_level],
                    'bmi': [bmi],
                    'smoking_status': [smoking_status]
                })
                
                # Codificar variables categóricas
                label_encoder = LabelEncoder()
                input_data['work_type'] = label_encoder.fit_transform(input_data['work_type'])
                input_data['Residence_type'] = label_encoder.fit_transform(input_data['Residence_type'])
                input_data['smoking_status'] = label_encoder.fit_transform(input_data['smoking_status'])

                prediction = self.modelos['stroke_decision_tree_model'].predict(input_data)

                # Devolver la predicción
                return prediction[0]  # El precio promedio predicho
            except Exception as e:
                print(f"Error predicting with model 'Stroke clasifier': {e}")
                return None

    def modelo_SP_stockValue(self, date):
        try:
            date_to_predict = pd.to_datetime(date)
            
            prediction = self.modelos['s&p_model'].predict(start=date_to_predict, dynamic=False)
            
            fixedPrediction = round(prediction[0], 2)
            result = f"Se estima un valor de {fixedPrediction} para el día indicado."
            
            # Devolver la predicción
            return result  # El precio promedio predicho
        except Exception as e:
            print(f"Error predicting with model 'S&P 500 Stock value': {e}")
            return None


if __name__ == "__main__":
    model_loader = ModelLoading()

    