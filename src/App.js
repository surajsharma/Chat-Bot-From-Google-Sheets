import React, { useEffect, useState, useRef } from "react";
import "./style.css";

const NUM_OPTIONS = 3;

export default function App() {
  let [msgs, setMsgs] = useState([]);
  let [excel, setExcel] = useState(null);
  let [visitor, setVisitor] = useState(0);
  const scroll = useRef(null);
  useEffect(async () => {
    const response = await fetch(
      "https://spreadsheets.google.com/feeds/cells/1ds-MhihXq39ud4_ViP4XKhYFizk0MmUBp5NFgylMEXA/1/public/full?alt=json"
    );

    const data = await response.json();
    const cells = data.feed.entry.map(e => e.gs$cell);
    let questions = [],
      options = [],
      actions = [],
      messages = [];
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
        let sliceStarts = index === 0 ? 0 : NUM_OPTIONS * index;
        let sliceEnds = sliceStarts + NUM_OPTIONS;
        message.content = q;
        message.options = options.slice(sliceStarts, sliceEnds);
        message.actions = actions.slice(sliceStarts, sliceEnds);
        messages = [...messages, message];
      });

    if (messages.length) {
      setMsgs(messages);
    }
    setExcel(data);
  }, []);

  const handleClickOption = e => {
    setVisitor(visitor + 1);
    alert("you clicked on " + e.target.innerHTML);
    scroll.current.scrollIntoView();
  };

  return (
    <div>
      <h1 onClick={() => console.log(msgs)}>
        Chat Bot From Google Sheets {excel && excel.version}
      </h1>

      <hr />
      {msgs &&
        msgs.map((m, index) => {
          if (index <= visitor) {
            {
              return (
                <div
                  key={m.content}
                  style={{
                    padding: "20px",
                    marginTop: "40px"
                  }}
                >
                  {m.content}
                  <br />
                  <div style={{ float: "right" }}>
                    {m.options.map(o => {
                      return (
                        <div>
                          <button
                            key={o}
                            onClick={handleClickOption}
                            style={{ marginTop: "5px" }}
                            ref={scroll}
                          >
                            {o}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          }
        })}
    </div>
  );
}
