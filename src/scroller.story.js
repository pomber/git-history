import React from "react";
import { storiesOf } from "@storybook/react";
import Scroller from "./scroller";

const snapAreas1 = [
  { start: 1, end: 5 },
  { start: 15, end: 26 },
  { start: 50, end: 100 },
  { start: 300, end: 302 }
];

const snapAreas2 = [
  { start: 8, end: 12 },
  { start: 30, end: 32 },
  { start: 550, end: 552 }
];

const items = Array(600)
  .fill(0)
  .map((_, i) => {
    const a1 = snapAreas1.find(a => a.start <= i && i <= a.end);
    const a2 = snapAreas2.find(a => a.start <= i && i <= a.end);
    return {
      content: `Row ${i}${
        a1
          ? ` - Area1 [${a1.start}, ${a1.end}]`
          : a2
          ? ` - Area2 [${a2.start}, ${a2.end}]`
          : ""
      }`,
      key: i,
      height: 22
    };
  });

function getRow(item) {
  return (
    <div key={item.key} style={{ height: item.height }}>
      {item.content}
    </div>
  );
}

function getRowHeight(item) {
  return item.height;
}

function BasicScroller({ areas }) {
  const [top, setTop] = React.useState(40);
  return (
    <Scroller
      items={items}
      snapAreas={areas}
      getRow={getRow}
      getRowHeight={getRowHeight}
      top={top}
      setTop={setTop}
    />
  );
}

storiesOf("Scroller", module).add("single", () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "90vh"
    }}
  >
    <div style={{ width: "60%", height: "80vh", border: "1px solid black" }}>
      <BasicScroller areas={snapAreas1} />
    </div>
  </div>
));

function DoubleScroller() {
  const [flag, setFlag] = React.useState(false);
  return (
    <div>
      <div style={{ height: "80vh", border: "1px solid black", width: "60vw" }}>
        <BasicScroller areas={flag ? snapAreas1 : snapAreas2} />
      </div>
      <div>
        {flag ? "Areas 1" : "Areas 2"}
        <button onClick={() => setFlag(flag => !flag)}>Toggle</button>
      </div>
    </div>
  );
}

storiesOf("Scroller", module).add("multiple", () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "90vh"
    }}
  >
    <DoubleScroller />
  </div>
));
