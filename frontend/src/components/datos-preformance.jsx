import { TextEffect } from "./ui/text-effect";

export default function DatosPerformance({ metrics }) {
  if (!metrics) {
    return <p>No se encontraron métricas de performance.</p>;
  }

  const rows = metrics.trim().split("\n");
  const headers = rows[0].split(",");
  const values = rows[1]?.split(",");

  if (!values || values.length !== headers.length) {
    return <p>Error al procesar las métricas.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {headers.map((header, idx) => {
        const value = values[idx];
        const isNumeric = !isNaN(parseFloat(value));

        return (
          <div
            key={idx}
            className="bg-black rounded-xl p-5 shadow-lg text-white flex flex-col items-center justify-center"
          >
            <span className="text-sm text-muted-foreground mb-2">{header}</span>
            {isNumeric ? (
              <TextEffect
                as="span"
                per="char"
                preset="scale"
                speedReveal={2}
                speedSegment={2}
                className="text-2xl font-bold hover:text-blue-500 transition-all duration-300"
              >
                {parseFloat(value).toFixed(4)}
              </TextEffect>
            ) : (
              <TextEffect
                as="span"
                per="word"
                preset="fade-in-blur"
                speedReveal={2}
                className="text-xl font-semibold hover:text-blue-500 transition-all duration-300"
              >
                {value}
              </TextEffect>
            )}
          </div>
        );
      })}
    </div>
  );
}
