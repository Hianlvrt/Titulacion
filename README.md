# Investment Price Prediction

This project aims to predict investment prices using historical data from the `investCeconsud.csv` file. The project utilizes a Long Short-Term Memory (LSTM) neural network to forecast future prices based on past trends. The data is preprocessed, scaled, and split into training and testing sets. The model is trained on the training set and evaluated on the testing set. The results are visualized and saved as graphs.

## Key Features

- **Data Preprocessing and Scaling**: Prepare the data for model training.
- **LSTM Model Training and Prediction**: Use an LSTM neural network to predict future investment prices.
- **Visualization**: Compare actual vs. predicted prices using graphs.

## Usage

1. Ensure all dependencies are installed.
2. Run the `basicModel.py` script to train the model and generate predictions.
3. View the generated graphs to analyze the prediction results.

## Setup

### Configure Pyenv

Add the following lines to your shell configuration file (e.g., `.bashrc`, `.zshrc`):

```sh
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

Restart your shell to apply the changes.

### Create a New Environment

Create a new Python environment for the project:

```sh
pyenv install 3.12.8
pyenv virtualenv 3.12.8 investment-models-env
pyenv activate investment-models-env
```

### Install Dependencies

Install the required dependencies using `pip` and the `requirements.txt` file:

```sh
pip install -r requirements.txt
```

### Run the Project

To train the model and generate predictions, run the following script:

```sh
python basicModel.py
```

## Results

After running the script, the results will be saved as graphs, allowing you to compare actual and predicted prices.


Predicción de Precios de Inversión
Este proyecto tiene como objetivo predecir los precios de inversión utilizando datos históricos del archivo investCeconsud.csv. Se utiliza una red neuronal Long Short-Term Memory (LSTM) para pronosticar precios futuros basándose en tendencias pasadas. Los datos son preprocesados, escalados y divididos en conjuntos de entrenamiento y prueba. El modelo se entrena con el conjunto de entrenamiento y se evalúa con el conjunto de prueba. Los resultados se visualizan y se guardan en forma de gráficos.

Características Principales
Preprocesamiento y Escalado de Datos: Preparar los datos para el entrenamiento del modelo.
Entrenamiento y Predicción con LSTM: Utilizar una red neuronal LSTM para predecir los precios futuros de inversión.
Visualización: Comparar los precios reales frente a los precios predichos mediante gráficos.
Uso
Asegúrate de que todas las dependencias estén instaladas.
Ejecuta el script basicModel.py para entrenar el modelo y generar predicciones.
Revisa los gráficos generados para analizar los resultados de la predicción.
Configuración
Configurar Pyenv
Agrega las siguientes líneas a tu archivo de configuración del shell (por ejemplo, .bashrc, .zshrc):

sh
Copiar código
export PATH="$HOME/.pyenv/bin:$PATH"
eval "$(pyenv init --path)"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
Reinicia tu shell para aplicar los cambios.

Crear un Nuevo Entorno
Crea un nuevo entorno de Python para el proyecto:

sh
Copiar código
pyenv install 3.12.8
pyenv virtualenv 3.12.8 investment-models-env
pyenv activate investment-models-env
Instalar Dependencias
Instala las dependencias necesarias utilizando pip y el archivo requirements.txt:

sh
Copiar código
pip install -r requirements.txt
Ejecutar el Proyecto
Para entrenar el modelo y generar predicciones, ejecuta el siguiente script:

sh
Copiar código
python basicModel.py
Resultados
Después de ejecutar el script, los resultados se guardarán como gráficos, lo que te permitirá comparar los precios reales con los predichos.

------------------------------------------------------
## 🛠️ Modo de uso
### Backend
```bash
# 1. Navegar al directorio backend
cd backend

# 2. Activar entorno virtual (Windows)
venv\Scripts\activate

# 3. Instalar dependencias (si tienes requirements.txt)
pip install -r requirements.txt

# 4. Iniciar la aplicación
python app.py
```

### Frontend
```bash
# 1. Navegar al directorio frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```









