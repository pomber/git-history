import React from "react";
import { storiesOf } from "@storybook/react";
import Scroller from "./scroller";

const snapAreas = [
  { start: 1, end: 5 },
  { start: 15, end: 26 },
  { start: 50, end: 100 },
  { start: 300, end: 302 }
];

const items = Array(500)
  .fill(0)
  .map((_, i) => {
    const a = snapAreas.find(a => a.start <= i && i <= a.end);
    return {
      content: `Row ${i}${a ? ` - Area [${a.start}, ${a.end}]` : ""}`,
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

function BasicScroller() {
  const [top, setTop] = React.useState(40);
  return (
    <Scroller
      items={items}
      snapAreas={snapAreas}
      getRow={getRow}
      getRowHeight={getRowHeight}
      top={top}
      setTop={setTop}
    />
  );
}

storiesOf("Scroller", module).add("test", () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "90vh"
    }}
  >
    <div style={{ width: "60%", height: "80vh", border: "1px solid black" }}>
      <BasicScroller />
    </div>
  </div>
));
