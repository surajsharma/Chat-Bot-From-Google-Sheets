import React, { useEffect, useState } from "react";
import "./style.css";

const NUM_OPTIONS = 3;

export default function App() {
  let [excel, setExcel] = useState(null);
  let [cells, setCells] = useState(null);
  let [msgs, setMsgs] = useState([]);

  useEffect(async () => {
    const response = await fetch(
      "https://spreadsheets.google.com/feeds/cells/1ds-MhihXq39ud4_ViP4XKhYFizk0MmUBp5NFgylMEXA/1/public/full?alt=json"
    );

    const data = await response.json();
    setExcel(data);
  }, []);

  useEffect(() => {
    if (excel) {
      const newCells = excel.feed.entry.map(e => e.gs$cell);
      setCells(newCells);
    }
  }, [excel]);

  useEffect(() => {
    let message = { content: "", options: [], actions: [] };
    let messages = [];
    cells &&
      cells.forEach((c, index) => {
        if (index == 0 || index % 7 === 0) {
          console.log(c, index);
          message.content = c;
          // question
        }
      });
  }, [cells]);
  const handleClickOption = () => {};

  return (
    <div>
      <h1 onClick={() => console.log(visitor)}>
        Chat Bot From Google Sheets {excel && excel.version}
      </h1>
    </div>
  );
}
