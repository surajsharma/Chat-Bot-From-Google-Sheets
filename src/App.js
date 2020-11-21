import React, { useEffect, useState } from "react";
import "./style.css";

const NUM_OPTIONS = 3;

export default function App() {
  let [excel, setExcel] = useState(null);
  let [visitor, setVisitor] = useState(0);
  let [optionVisitor, setOptionVisitor] = useState(1);
  let [msgs, setMsgs] = useState([]);

  useEffect(async () => {
    const response = await fetch(
      "https://spreadsheets.google.com/feeds/cells/1ds-MhihXq39ud4_ViP4XKhYFizk0MmUBp5NFgylMEXA/1/public/full?alt=json"
    );

    const data = await response.json();
    setExcel(data);
  }, []);

  const handleClickOption = () => {
    // console.log("visitor update", entry);
    setVisitor(visitor + 1);
    setOptionVisitor(visitor + 2);
  };
  useEffect(() => {
    // update rendered messages to include entry[i].content.$t
  }, [visitor]);

  let entry = excel ? excel.feed.entry : null;
  // let options = [entry[visitor],entry[visitor+1],entry[visitor+2]...];

  let options = [];

  for (let i = 1; i <= NUM_OPTIONS * 2; i++) {
    if (entry) {
      if (i % 2 !== 0) {
        // console.log(entry[visitor + i].content.$t);
        options.push(entry[visitor + i].content.$t);
      }
    }
  }

  return (
    <div>
      <h1 onClick={() => console.log(visitor)}>
        Chat Bot From Google Sheets {excel && excel.version}
      </h1>
      {entry &&
        entry.map((entry, index) => {
          let text = entry.content.$t;
          return visitor === index ? <p key={index}>{text}</p> : null;
        })}
      {options &&
        options.map((option, index) => {
          return (
            <>
              <button onClick={handleClickOption} key={option}>
                {option}
              </button>
              <br />
            </>
          );
        })}
    </div>
  );
}

// <button>{excel && excel.feed.entry[0].content.$t}</button>
// <button>{excel && excel.feed.entry[1].content.$t}</button>
// <button>{excel && excel.feed.entry[2].content.$t}</button>
