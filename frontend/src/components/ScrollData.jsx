import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ScrollJsonTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/data/investCeconsud.json")
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
      });
  }, []);

  const Row = ({ index, style }) => {
    const row = rows[index];
    return (
      <div
        style={style}
        className="flex text-sm border-t px-2 py-1 min-w-full"
      >
        <div className="w-1/6 px-2">{row["Date"]}</div>
        <div className="w-1/6 px-2">{row["Last"]}</div>
        <div className="w-1/6 px-2">{row["Open"]}</div>
        <div className="w-1/6 px-2">{row["High"]}</div>
        <div className="w-1/6 px-2">{row["Low"]}</div>
        <div className="w-1/6 px-2">{row["Vol"]}</div>
        <div className="w-1/6 px-2">{row["Change"]}</div>
      </div>
    );
  };

  return (
    <ScrollArea className="h-[300px] w-full rounded-md border p-4 overflow-auto">
      {/* Encabezado fijo */}
      <div className="flex sticky top-0 bg-muted text-sm font-semibold border-b px-2 py-1 min-w-full z-10">
        <div className="w-1/6 px-2">Fecha</div>
        <div className="w-1/6 px-2">Último</div>
        <div className="w-1/6 px-2">Apertura</div>
        <div className="w-1/6 px-2">Alto</div>
        <div className="w-1/6 px-2">Bajo</div>
        <div className="w-1/6 px-2">Volumen</div>
        <div className="w-1/6 px-2">% Cambio</div>
      </div>

      {/* Filas virtualizadas */}
      <List
        height={250}
        itemCount={rows.length}
        itemSize={36}
        width="100%"
      >
        {Row}
      </List>
    </ScrollArea>
  );
}
