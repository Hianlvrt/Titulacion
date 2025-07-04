import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { Chart } from "react-charts";

// Escalar precios entre 0 y 1
function minMaxScale(data) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map((val) => (val - min) / (max - min));
}

// Convertir "dd.mm.yyyy" a Date
const parseDate = (str) => {
  if (!str || typeof str !== "string") return null;
  const [day, month, year] = str.trim().split(".");
  if (!day || !month || !year) return null;
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? null : date;
};

// Convertir número europeo a float
const parseNumber = (str) => {
  if (!str) return NaN;
  return parseFloat(str.replace(/\./g, "").replace(",", "."));
};

export default function Grafico2() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("/data/investCeconsud.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const cleanedData = parsed.data
          .map((row) => {
            const date = parseDate(row["Date"]);
            const price = parseNumber(row["Last"]);
            return date && !isNaN(price)
              ? { date, price }
              : null;
          })
          .filter((row) => row !== null);

        if (cleanedData.length === 0) {
          console.warn("No se encontraron datos válidos en el CSV.");
          return;
        }

        const scaledPrices = minMaxScale(cleanedData.map((d) => d.price));
        const fullData = cleanedData.map((d, i) => ({
          date: d.date,
          price: scaledPrices[i],
        }));

        const trainingData = fullData.filter(
          (d) => d.date < new Date("2023-01-01")
        );
        const testingData = fullData.filter(
          (d) => d.date >= new Date("2023-01-01")
        );

        const series = [
          {
            label: "Training Set",
            data: trainingData.map((d) => ({
              primary: d.date,
              secondary: d.price,
            })),
            style: { stroke: "#007bff" },
          },
          {
            label: "Testing Set",
            data: testingData.map((d) => ({
              primary: d.date,
              secondary: d.price,
            })),
            style: { stroke: "#ff9900" },
          },
        ];

        setChartData(series);
      })
      .catch((err) => {
        console.error("Error cargando CSV:", err);
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
        <p className="text-center text-muted-foreground">Cargando gráfico...</p>
      )}
    </div>
  );
}
