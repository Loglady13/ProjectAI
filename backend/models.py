import os
import pickle
import pandas as pd
import sklearn
import numpy as np

class ModelLoading:
    def __init__(self):
        self.modelos = self.load_models()

    @staticmethod
    def  load_models():
        directory_path = r'..\modelos'

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

if __name__ == "__main__":
    model_loader = ModelLoading()

    