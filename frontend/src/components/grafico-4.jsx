import React, { useState } from 'react';
import { Chart } from 'react-charts';
import { Button } from '@/components/ui/button';

const parseDate = (dateStr) => new Date(dateStr);

export default function Grafico4({ csvData1, csvData2, csvData3 }) {
  const [visible, setVisible] = useState('all'); // 'all', 'noNoise', 'withNoise', 'comparison'

  const createChartData = (csvData, labels) =>
    labels.map((label) => ({
      label,
      data: csvData.map((row) => ({
        primary: parseDate(row.Date),
        secondary: Number(row[label]),
      })),
    }));

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum) => datum.primary,
      scaleType: 'time',
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum.secondary,
        elementType: 'line',
      },
    ],
    []
  );

  const renderChart = (csvData, labels) => (
    <div className="w-full h-[400px] border rounded-md p-4 bg-white dark:bg-gray-900">
      {csvData?.length > 0 ? (
        <Chart
          options={{
            data: createChartData(csvData, labels),
            primaryAxis,
            secondaryAxes,
            tooltip: true,
          }}
        />
      ) : (
        <p className="text-center text-muted-foreground">No hay datos para mostrar</p>
      )}
    </div>
  );

  const chartTitle = {
    noNoise: 'Predicción Sin Ruido',
    withNoise: 'Predicción Con Ruido',
    comparison: 'Comparación de Predicciones',
    all: 'Visualización de Todos los Gráficos'
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center mt-4">
        <Button onClick={() => setVisible('noNoise')}>Predicción Sin Ruido</Button>
        <Button onClick={() => setVisible('withNoise')}>Predicción Con Ruido</Button>
        <Button onClick={() => setVisible('comparison')}>Comparación</Button>
        <Button variant="secondary" onClick={() => setVisible('all')}>Mostrar Todos</Button>
      </div>

      <h3 className="text-xl font-semibold text-center mt-4">
        {chartTitle[visible]}
      </h3>

      {visible === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderChart(csvData1, ['Predicted Price (No Noise)'])}
          {renderChart(csvData2, ['Predicted Price (With Noise)'])}
          {renderChart(csvData3, ['Predicted Price (No Noise)', 'Predicted Price (With Noise)'])}
        </div>
      )}

      {visible === 'noNoise' && renderChart(csvData1, ['Predicted Price (No Noise)'])}
      {visible === 'withNoise' && renderChart(csvData2, ['Predicted Price (With Noise)'])}
      {visible === 'comparison' && renderChart(csvData3, ['Predicted Price (No Noise)', 'Predicted Price (With Noise)'])}
    </div>
  );
}
