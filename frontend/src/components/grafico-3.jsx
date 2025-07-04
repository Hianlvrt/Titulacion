import React from "react";
import { Chart } from "react-charts";

// Función para convertir string "YYYY-MM-DD" o similar a objeto Date
const parseDate = (dateStr) => new Date(dateStr);

export default function Grafico3({ csvData }) {
  const data = React.useMemo(() => {
    return [
      {
        label: "Actual Price",
        data: csvData.map((row) => ({
          primary: parseDate(row.Date),
          secondary: Number(row["Actual Price"]),
        })),
      },
      {
        label: "Predicted Price",
        data: csvData.map((row) => ({
          primary: parseDate(row.Date),
          secondary: Number(row["Predicted Price"]),
        })),
      },
    ];
  }, [csvData]);

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
    <div className="w-full h-[400px] border rounded-md p-4 bg-white dark:bg-gray-900">
      {csvData?.length > 0 ? (
        <Chart
          options={{
            data,
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
}
