import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Chart } from "react-charts";

// Convertir "2.078,00" → 2078.00
const parseNumber = (str) =>
  parseFloat(str.replace(/\./g, "").replace(",", "."));

// Convertir "dd.mm.yyyy" → Date
const parseDate = (str) => {
  const [day, month, year] = str.split(".");
  return new Date(`${year}-${month}-${day}`);
};

// Downsample sin perder tendencia: toma 1 de cada "step" puntos
const downsample = (data, maxPoints = 500) => {
  if (data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
};

export default function Grafico1() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("/data/investCeconsud.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, { header: true });
        const data = parsed.data
          .filter((row) => row.Date && row.Last)
          .map((row) => ({
            primary: parseDate(row.Date),
            secondary: parseNumber(row.Last),
          }));

        const reducedData = downsample(data, 500); // Reduce visualmente si hay muchos
        setChartData([
          {
            label: "Último",
            data: reducedData,
          },
        ]);
      });
  }, []);

  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum) => datum.primary,
      scaleType: "time",
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum.secondary,
        elementType: "line",
      },
    ],
    []
  );

  return (
    <div className="w-full h-[400px] border rounded-lg p-4 bg-white dark:bg-gray-900">
      {chartData.length > 0 ? (
        <Chart
          options={{
            data: chartData,
            primaryAxis,
            secondaryAxes,
            tooltip: true,
          }}
        />
      ) : (
        <p className="text-center text-sm text-muted-foreground">Cargando gráfico...</p>
      )}
    </div>
  );
}
