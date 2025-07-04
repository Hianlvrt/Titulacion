from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import base64
import basicModel
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['GET'])
def predict():
    try:
        # Obtener parámetro de días desde la URL (default = 20)
        days = int(request.args.get('days', 20))

        # Llamar a la función principal con ese valor
        basicModel.main(days_to_predict=days)
        
        # Verificar si los archivos existen
        if not os.path.exists('price_prediction.png') or not os.path.exists('performance_metrics.csv') or not os.path.exists('price_over_time.png') or not os.path.exists('price_prediction_data.csv'):
            return jsonify({'error': 'No se pudieron generar las predicciones o imágenes'}), 500
        
        # Leer archivo CSV con métricas
        with open('performance_metrics.csv', 'r') as f:
            metrics = f.read()

        # Leer el archivo CSV con los datos del gráfico como DataFrame
        df_pred = pd.read_csv('price_prediction_data.csv')
        price_prediction_data = df_pred.to_dict(orient='records')
        
        # Leer y codificar imágenes en base64
        with open('price_prediction.png', 'rb') as f:
            prediction_image = base64.b64encode(f.read()).decode('utf-8')
        
        with open('price_over_time.png', 'rb') as f:
            time_image = base64.b64encode(f.read()).decode('utf-8')

        # Leer el archivo CSV future_prediction_no_noise.csv
        df_future = pd.read_csv('future_prediction_no_noise.csv')
        future_prediction_no_noise = df_future.to_dict(orient='records')

        # Leer el archivo CSV future_prediction_with_noise.csv
        df_future_with_noise = pd.read_csv('future_prediction_with_noise.csv')
        future_prediction_with_noise = df_future_with_noise.to_dict(orient='records')

        # Leer el archivo csv future_predictions_comparison.csv
        df_future_comparison = pd.read_csv('future_predictions_comparison.csv')
        future_prediction_comparison = df_future_comparison.to_dict(orient='records')
        
        return jsonify({
            'metrics': metrics,
            'predictionImage': prediction_image,
            'timeImage': time_image,
            'pricePredictionData': price_prediction_data,  # nuevo!
            'futurePredictionNoNoise': future_prediction_no_noise,
            'futurePredictionWithNoise': future_prediction_with_noise,
            'futurePredictionComparison': future_prediction_comparison

        })
    



    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
