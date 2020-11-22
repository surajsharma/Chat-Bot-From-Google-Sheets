import React, { useEffect, useState } from "react";
import "./style.css";

const NUM_OPTIONS = 3;

export default function App() {
  let [msgs, setMsgs] = useState([]);
  let [excel, setExcel] = useState(null);
  let [visitor, setVisitor] = useState(0);
  useEffect(async () => {
    const response = await fetch(
      "https://spreadsheets.google.com/feeds/cells/1ds-MhihXq39ud4_ViP4XKhYFizk0MmUBp5NFgylMEXA/1/public/full?alt=json"
    );

    const data = await response.json();
    const cells = data.feed.entry.map(e => e.gs$cell);
    let questions = [],
      options = [],
      actions = [];
    let messages = [];
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
        let message = { content: "", options: [], actions: [] };
        message.content = q;
        let sliceStarts = index === 0 ? 0 : NUM_OPTIONS * index;
        let sliceEnds = sliceStarts + NUM_OPTIONS;
        message.options = options.slice(sliceStarts, sliceEnds);
        message.actions = actions.slice(sliceStarts, sliceEnds);
        messages = [...messages, message];
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

      {msgs &&
        msgs.map((m, index) => {
          if (index <= visitor) {
            {
              return (
                <div key={index}>
                  {m.content}
                  <br />
                  {m.options.map(o => {
                    return (
                      <>
                        <button>{o}</button> <br />
                      </>
                    );
                  })}
                </div>
              );
            }
          }
        })}
    </div>
  );
}
