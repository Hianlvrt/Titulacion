import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from datetime import timedelta

# Define the path to the CSV file
CSV_FILE_PATH = 'investCeconsud.csv'

# Define the number of time steps to look back for the LSTM model
TIME_STEP = 60


scaler = MinMaxScaler()

# Define a function to convert CLP formatted string to USD float
def clp_to_usd(clp_string, exchange_rate=800):
    # Remove the period used as thousand separator and replace comma with dot
    clp_string = clp_string.replace('.', '').replace(',', '.')
    # Convert to float and divide by the exchange rate
    usd_value = float(clp_string) / exchange_rate
    return usd_value

def load_and_prepare_data(csv_file_path):
    # Read the CSV file into a DataFrame with 'Date' as the index column and parse dates
    df = pd.read_csv(csv_file_path, index_col='Date', parse_dates=['Date'])

    # Sort the DataFrame by the index to ensure it is monotonic
    df.sort_index(inplace=True)

    # Only keep the column Date and High in the DataFrame
    df = df[['High']]
    df.columns = ['price']

    return df

def create_and_scale_datasets(df, train_end_date='2022', test_start_date='2023'):
    # Create a training set and a testing set from the original dataset
    training_set = df.loc[:train_end_date]
    testing_set = df.loc[test_start_date:]

    # Scale the training set and testing set between 0 and 1 using MinMaxScaler

    training_set['price'] = scaler.fit_transform(training_set[['price']])
    testing_set['price'] = scaler.transform(testing_set[['price']])

    return training_set, testing_set


def generate_train_data(training_set, time_step):
    X_train = []
    Y_train = []
    m = len(training_set)
    for i in range(time_step, m):
        X_train.append(training_set['price'].values[i-time_step:i])
        Y_train.append(training_set['price'].values[i])
    X_train, Y_train = np.array(X_train), np.array(Y_train)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
    return X_train, Y_train

def generate_data(dataset, time_step):
    X, Y = [], []
    m = len(dataset)
    for i in range(time_step, m):
        X.append(dataset['price'].values[i-time_step:i])
        Y.append(dataset['price'].values[i])
    X, Y = np.array(X), np.array(Y)
    X = np.reshape(X, (X.shape[0], X.shape[1], 1))
    return X, Y


def plot_and_save_graph(x_data, y_data, x_label, y_label, title, legend_labels, colors, filename, figsize=(14, 5)):
    plt.figure(figsize=figsize)
    for i in range(len(y_data)):
        plt.plot(x_data[i], y_data[i], color=colors[i], label=legend_labels[i])
    plt.xlabel(x_label)
    plt.ylabel(y_label)
    plt.title(title)
    plt.legend()
    plt.savefig(filename)
    plt.close()

 

def train_lstm_model(X_train, Y_train, neurons=50, epochs=100, batch_size=32, optimizer='rmsprop', loss='mean_squared_error'):
    """
    Trains an LSTM model on the provided training data.
    Parameters:
    X_train (numpy.ndarray): The input training data, expected to be a 3D array of shape (samples, timesteps, features).
    Y_train (numpy.ndarray): The output training data, expected to be a 2D array of shape (samples, output_features).
    neurons (int, optional): The number of neurons in the LSTM layer. Default is 50.
    epochs (int, optional): The number of epochs to train the model. Default is 100.
    batch_size (int, optional): The number of samples per gradient update. Default is 32.
    optimizer (str, optional): The optimizer to use for training the model. Default is 'rmsprop'.
    loss (str, optional): The loss function to use for training the model. Default is 'mean_squared_error'.
    Returns:
    keras.models.Sequential: The trained LSTM model.
    """
    # Create and train an LSTM model with the given parameters
    len_X_train = (X_train.shape[1], 1)
    len_output = 1

    # Create the LSTM model
    model = Sequential()
    model.add(LSTM(units=neurons, input_shape=len_X_train))
    model.add(Dense(units=len_output))
    model.compile(optimizer=optimizer, loss=loss)

    # Fit the model
    model.fit(X_train, Y_train, epochs=epochs, batch_size=batch_size)
    
    return model



def evaluate_model_performance(actual, predicted):
    """
    Evaluates the performance of the model by calculating various statistics.
    Parameters:
    actual (numpy.ndarray): The actual prices.
    predicted (numpy.ndarray): The predicted prices.
    Returns:
    dict: A dictionary containing various performance metrics.
    """

    # Calculate Mean Squared Error
    mse = mean_squared_error(actual, predicted)
    
    # Calculate Mean Absolute Error
    mae = mean_absolute_error(actual, predicted)
    
    # Calculate Root Mean Squared Error
    rmse = np.sqrt(mse)
    
    # Calculate R-squared
    r2 = r2_score(actual, predicted)
    
    # Calculate Mean Absolute Percentage Error
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100
    
    # Return the performance metrics in a dictionary
    return {
        'Mean Squared Error': mse,
        'Mean Absolute Error': mae,
        'Root Mean Squared Error': rmse,
        'R-squared': r2,
        'Mean Absolute Percentage Error': mape
    }


def save_performance_metrics(model_name, performance_metrics, filename='performance_metrics.csv'):
    with open(filename, 'w') as f:
        f.write('Model,')
        f.write(','.join(performance_metrics.keys()))
        f.write('\n')
        f.write(f'{model_name},')
        f.write(','.join(map(str, performance_metrics.values())))
        f.write('\n')

def predict_future_prices(model, last_sequence, days_to_predict, noise_scale=0.02):
    """
    Realiza predicciones futuras utilizando el último bloque de datos conocido.
    Se le añade ruido leve a cada predicción para evitar acumulación lineal.
    """
    future_predictions = []
    current_input = last_sequence.copy()

    for _ in range(days_to_predict):
        pred = model.predict(current_input.reshape(1, -1, 1), verbose=0)
        
        # Agregar ruido leve para evitar curva artificial
        pred += np.random.normal(loc=0.0, scale=noise_scale)
        
        future_predictions.append(pred[0][0])
        current_input = np.append(current_input[1:], pred[0][0])

    return np.array(future_predictions)


def generate_future_dates(start_date, days):
    return [pd.Timestamp(start_date + timedelta(days=i + 1)) for i in range(days)]


def main(days_to_predict=20):
    # Load and prepare the data
    investment_data_df = load_and_prepare_data(CSV_FILE_PATH)

    # Apply the conversion function to the 'price' column to convert it to USD
    investment_data_df['price'] = investment_data_df['price'].apply(clp_to_usd)

    # Create and scale the datasets
    training_set, testing_set = create_and_scale_datasets(investment_data_df)

    # Plot and save the training set and testing set
    plot_and_save_graph(
        x_data=[training_set.index, testing_set.index],
        y_data=[training_set['price'], testing_set['price']],
        x_label='Date',
        y_label='Price',
        title='Price over Time',
        legend_labels=['Training Set', 'Testing Set'],
        colors=['blue', 'orange'],
        filename='price_over_time.png'
    )

    # Generate the training data
    X_train, Y_train = generate_data(training_set, TIME_STEP)

    # Generate the testing data
    X_test, Y_test = generate_data(testing_set, TIME_STEP)

    # Train the model with the specified parameters
    model = train_lstm_model(X_train, Y_train, neurons=50, epochs=100, batch_size=32)

    # Make predictions
    predicted_price = model.predict(X_test)

    # Inverse transform the predicted prices and actual prices to original scale
    predicted_price = scaler.inverse_transform(predicted_price)
    actual_price = scaler.inverse_transform(Y_test.reshape(-1, 1))

    # Evaluate the model performance
    performance_metrics = evaluate_model_performance(actual_price, predicted_price)

    # Save the performance metrics
    save_performance_metrics('LSTM Model', performance_metrics)
    
    # Guardar los datos del gráfico en un CSV
    df_results = pd.DataFrame({
        'Date': testing_set.index[TIME_STEP:],
        'Actual Price': actual_price.flatten(),
        'Predicted Price': predicted_price.flatten()
    })
    df_results.to_csv('price_prediction_data.csv', index=False)


    # Plot and save the results|
    plot_and_save_graph(
        x_data=[testing_set.index[TIME_STEP:],testing_set.index[TIME_STEP:]],
        y_data=[actual_price, predicted_price],
        x_label='Date',
        y_label='Price',
        title='Price Prediction',
        legend_labels=['Actual Price', 'Predicted Price'],
        colors=['blue', 'red'],
        filename='price_prediction.png'
    )
   
 # -----------------------------------------
    # FUTURE PREDICTION (comparación con y sin ruido)
    # -----------------------------------------

    # days_to_predict = 20  # Puedes cambiar este valor para predecir más/menos días

    # Escalar todos los datos históricos
    full_scaled = scaler.fit_transform(investment_data_df[['price']])
    last_sequence = full_scaled[-TIME_STEP:].flatten()

    # Predicción sin ruido
    future_scaled_clean = predict_future_prices(model, last_sequence, days_to_predict=days_to_predict)
    future_unscaled_clean = scaler.inverse_transform(future_scaled_clean.reshape(-1, 1))

    # Predicción con ruido dinámico
    future_scaled_noisy = predict_future_prices(model, last_sequence, days_to_predict=days_to_predict)
    future_unscaled_noisy = scaler.inverse_transform(future_scaled_noisy.reshape(-1, 1))

    # Generar fechas futuras
    last_date = investment_data_df.index[-1]
    future_dates = generate_future_dates(last_date, days_to_predict)

    # Guardar resultados individuales como CSV
    df_future_clean = pd.DataFrame({
        'Date': future_dates,
        'Predicted Price (No Noise)': future_unscaled_clean.flatten()
    })
    df_future_clean.to_csv('future_prediction_no_noise.csv', index=False)

    df_future_noisy = pd.DataFrame({
        'Date': future_dates,
        'Predicted Price (With Noise)': future_unscaled_noisy.flatten()
    })
    df_future_noisy.to_csv('future_prediction_with_noise.csv', index=False)

    # Guardar gráfico comparativo de ambas curvas
    def plot_future_comparison(dates, clean, noisy, filename='future_comparison.png'):
        plt.figure(figsize=(14,5))
        plt.plot(dates, clean, label='Predicción sin ruido', color='blue')
        plt.plot(dates, noisy, label='Predicción con ruido', color='green')
        plt.title('Comparación: Predicción futura con y sin ruido')
        plt.xlabel('Fecha')
        plt.ylabel('Precio')
        plt.legend()
        plt.savefig(filename)
        plt.close()

    plot_future_comparison(future_dates, future_unscaled_clean, future_unscaled_noisy)

    # Guardar ambos resultados combinados en un solo CSV
    df_combined = pd.DataFrame({
        'Date': future_dates,
        'Predicted Price (No Noise)': future_unscaled_clean.flatten(),
        'Predicted Price (With Noise)': future_unscaled_noisy.flatten()
    })
    df_combined.to_csv('future_predictions_comparison.csv', index=False)
 

if __name__ == "__main__":
    main()

