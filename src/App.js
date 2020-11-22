import React, { useEffect, useState } from "react";
import "./style.css";

const NUM_OPTIONS = 3;

export default function App() {
  let [excel, setExcel] = useState(null);
  let [cells, setCells] = useState(null);
  let [msgs, setMsgs] = useState([]);
  let [messagesSet, setMessagesSet] = useState(false);

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
    if (!messagesSet) {
      let message = { content: "", options: [], actions: [] };
      let messages = [];
      let questions = [],
        options = [],
        actions = [];

      cells &&
        cells.forEach((c, index) => {
          if (index == 0 || index % 7 === 0) {
            questions.push(c.$t);
          } else {
            if (c.col == 2) {
              actions.push(c.$t);
            } else {
              options.push(c.$t);
            }
          }
        });

      questions &&
        questions.forEach((q, index) => {
          message.content = q;
          let sliceStarts = index === 0 ? 0 : NUM_OPTIONS * index;
          let sliceEnds = sliceStarts + NUM_OPTIONS;
          message.options = options.slice(sliceStarts, sliceEnds);
          message.actions = actions.slice(sliceStarts, sliceEnds);
          messages.push(message);
        });
      setMsgs(messages);
      setMessagesSet(true);
    }
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
