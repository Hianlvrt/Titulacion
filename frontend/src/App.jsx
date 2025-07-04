// src/App.jsx
import React, { useState } from "react";
import { Navbar } from "./components/navbar";
import ScrollJsonTable from "./components/ScrollData";
import Grafico3 from "./components/grafico-3";
import Grafico1 from "./components/grafico-1";
import Grafico2 from "./components/grafico-2";
import Grafico4 from "./components/grafico-4";
import { Loader2 } from "lucide-react";
import DatosPerformance from "./components/datos-preformance";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./components/ui/alert-dialog";
import { useToast } from "./hooks/use-toast";
import Footer from "./components/footer";
import { Toast } from "./components/ui/toast";

export default function App() {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState("");
  const [futurePredictionNoNoise, setFuturePredictionNoNoise] = useState([]);
  const [futurePredictionWithNoise, setFuturePredictionWithNoise] = useState(
    []
  );
  const [futurePredictionComparison, setFuturePredictionComparison] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [ejecucionCompleta, setEjecucionCompleta] = useState(false);
  const [days, setDays] = useState("20");
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();

  const handleConfirmedEjecutar = async () => {
    setLoading(true);
    setData([]);
    setMetrics("");
    setEjecucionCompleta(false);

    try {
      const daysParam = Number(days) || 1;
      const response = await fetch(
        `http://localhost:5000/predict?days=${daysParam}`
      );
      const json = await response.json();
      setData(json.pricePredictionData || []);
      setMetrics(json.metrics || "");
      setFuturePredictionNoNoise(json.futurePredictionNoNoise || []);
      setFuturePredictionWithNoise(json.futurePredictionWithNoise || []);
      setFuturePredictionComparison(json.futurePredictionComparison || []);
      setEjecucionCompleta(true);
      setEjecucionCompleta(true);
      Toast({
        title: "Ejecución completada",
        description: `Predicción para ${days} días ejecutada correctamente.`,
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Error al consultar la API",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleEjecutar = () => {
    const numDays = Number(days);
    if (numDays > 30) {
      toast({
        title: "Error",
        description: "No se puede predecir más de 30 días.",
        variant: "destructive",
      });
      return;
    }
    if (numDays < 1) {
      toast({
        title: "Error",
        description: "Debe ser al menos 1 día.",
        variant: "destructive",
      });
      setDays("1");
      return;
    }
    setOpenDialog(true);
  };

  return (
  <main className="min-h-screen flex flex-col">
    <Navbar />
    <div className="p-4 md:p-6 flex justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center text-center space-y-16">

               {/* Encabezado principal */}
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Sistema de Predicción de Precios de Acciones
              <br />
              CENCOSUD
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto">
              Este sitio permite visualizar el proceso de predicción de acciones de CENCOSUD, detallando los datos históricos, el modelo de predicción y los resultados obtenidos.
            </p>
          </div>

          {/* Tabla de datos históricos */}
          <div className="w-full max-w-6xl space-y-4">
            <h2 id="datos-historicos" className="text-4xl font-bold">Datos Históricos</h2>
            <p className="text-xl text-muted-foreground">
              Esta tabla muestra los datos históricos de precios. Puedes desplazarte para ver más datos.
            </p>
            <ScrollJsonTable />
          </div>

          {/* Bloque de texto 1 */}
          <div className="w-full max-w-4xl space-y-2">
            <h2 className="text-2xl font-bold">Información General</h2>
            <p className="text-muted-foreground">
              En la tabla presentada se pueden visualizar todos los datos históricos utilizados en el sistema de predicción. 
              <br />
              Contempla datos desde 2017 hasta fines de 2024.
            </p>
          </div>
          
        <hr className="border-t border-black dark:border-white w-full my-4" />



          {/* Gráfico de datos históricos */}
          <div className="w-full max-w-4xl space-y-2">
            <h2 id="grafico-prediccion" className="text-2xl font-bold">Gráfico histórico de valores</h2>
            <p className="text-muted-foreground">
              Este gráfico nos permite visualizar el comportamiento histórico de los precios de las acciones de CENCOSUD, información que es fundamental para comprender las tendencias y patrones que el modelo de predicción utilizará para generar sus estimaciones futuras.
            </p>
            <Grafico1 />
          </div>

           <hr className="border-t border-black dark:border-white w-full my-4" />

          {/* Bloque de texto 2 */}
          <div className="w-full max-w-4xl space-y-2">
            <h2 className="text-2xl font-bold">Ejecución de Sistema</h2>
            <p className="text-muted-foreground">
              A continuación, podrás seleccionar ejecutar el sistema de predicción para visualizar como este analiza y realiza las predicciones en base a los datos históricos.
              <br />
              Además, podrás ingresar un valor de días para realizar una predicción futura de precios, este valor puede ser entre 1 y 30 días.
            </p>
          </div>

          {/* Formulario de predicción */}
          <div className="w-full max-w-4xl border rounded-md p-6 bg-slate-200 dark:bg-gray-900 space-y-6">
            <h2 id="prediccion" className="text-2xl font-bold">Sistema de Predicción</h2>
            <p className="">
              Selecciona el número de días y ejecuta el modelo para obtener predicciones futuras (1 a 30 días).
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <Label htmlFor="days" className="text-base">
                  Días a predecir:
                </Label>
                <Input
                  id="days"
                  type="number"
                  value={days}
                  min={1}
                  max={30}
                  onChange={(e) => {
                    let value = e.target.value;
                    if (Number(value) > 30) value = "30";
                    setDays(value);
                  }}
                  onBlur={() => {
                    if (days.trim() === "" || Number(days) < 1) setDays("1");
                  }}
                  className="w-24 border border-gray-300 dark:border-gray-700 rounded-md p-2 text-lg"
                  placeholder="20"
                />
              </div>
              <Button
                onClick={handleEjecutar}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-semibold rounded-2xl shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" /> Procesando...
                  </div>
                ) : (
                  "Ejecutar Predicción"
                )}
              </Button>
            </div>
          </div>

          {/* Modal de confirmación */}
          <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Ejecutar predicción?</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de ejecutar la predicción para {days} días?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOpenDialog(false)}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setOpenDialog(false);
                    handleConfirmedEjecutar();
                  }}
                  disabled={loading}
                >
                  Sí, ejecutar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Resultados si ejecución está completa */}
          {ejecucionCompleta && (
            <div className="w-full flex flex-col items-center space-y-16">

              <div className="w-full max-w-4xl space-y-2">
                <h2 className="text-2xl font-bold">Gráfico de Entrenamiento y Test</h2>
                <Grafico2 />
              </div>

              <div className="w-full max-w-4xl space-y-2">
                <h2 className="text-2xl font-bold">Preparación del Dataset</h2>
                <p className="text-muted-foreground">
                  En el reciente gráfico se puede observar como se ha preparado el dataset para el entrenamiento del modelo de predicción.
                  <br />
                  Este proceso incluye la normalización de los datos y la división en conjuntos de entrenamiento y prueba, lo cual es crucial para evaluar el rendimiento del modelo.
                </p>
              </div>

               <hr className="border-t border-black dark:border-white w-full my-4" />

              <div className="w-full max-w-4xl space-y-2">
                <h2 className="text-2xl font-bold">Gráfico de Predicción</h2>
                <Grafico3 csvData={data} />
              </div>

<div className="w-full max-w-4xl space-y-2">
                <h2 className="text-2xl font-bold">Análisis de predicción</h2>
                <p className="text-muted-foreground">
                  En el gráfico presentado se puede observar como se ha comportado el modelo de predicción en base a los datos históricos de prueba.
                  <br />
                  En el color Azul podemos ver los datos históricos reales, mientras que en amarillo visualizamos la predicción realizada por el modelo.
                  <br />
                  A continuación, analicemos las métricas que nos permitirán concluir si nuestro modelo fue exitosos en su predicción.
                </p>
              </div>

              <div className="w-full max-w-4xl space-y-2">
                <h2 className="text-2xl font-bold">Métricas de Predicción</h2>
                <DatosPerformance metrics={metrics} />
              </div>

               <hr className="border-t border-black dark:border-white w-full my-4" />

              <div className="w-full max-w-4xl space-y-2">
                <h2 className="text-2xl font-bold">Predicción de Precios Futuros</h2>
                <p className="text-muted-foreground">
                  Predicción generada con {Number(days)} días seleccionados, incluye escenarios con y sin ruido Gaussiano, además de un gráfico comparativo que nos permitirá visualizar las diferencias.
                </p>
                <Grafico4
                  csvData1={futurePredictionNoNoise}
                  csvData2={futurePredictionWithNoise}
                  csvData3={futurePredictionComparison}
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
  </main>
);
}

