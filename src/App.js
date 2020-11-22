import React, { useEffect, useState } from "react";
import "./style.css";

const NUM_OPTIONS = 3;

export default function App() {
  let [msgs, setMsgs] = useState([]);
  let [excel, setExcel] = useState(null);

  useEffect(async () => {
    const response = await fetch(
      "https://spreadsheets.google.com/feeds/cells/1ds-MhihXq39ud4_ViP4XKhYFizk0MmUBp5NFgylMEXA/1/public/full?alt=json"
    );

    const data = await response.json();
    const cells = data.feed.entry.map(e => e.gs$cell);
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

    if (messages.length) {
      setMsgs(messages);
    }
    setExcel(data);
  }, []);

  const handleClickOption = () => {};

  return (
    <div>
      <h1 onClick={() => console.log(msgs)}>
        Chat Bot From Google Sheets {excel && excel.version}
      </h1>
    </div>
  );
}
