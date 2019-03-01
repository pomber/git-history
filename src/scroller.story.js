import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import Scroller from "./scroller";

const items = Array(100)
  .fill(0)
  .map((_, i) => ({ content: `Row ${i}` }));

function getRow(item) {
  return <div>{item.content}</div>;
}

function getRowHeight(line) {
  return 15;
}

function BasicScroller() {
  const [top, setTop] = React.useState(0);
  return (
    <Scroller
      items={items}
      getRow={getRow}
      getRowHeight={getRowHeight}
      top={top}
      setTop={setTop}
    />
  );
}

storiesOf("Welcome", module).add("to Storybook", () => (
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

// storiesOf("Button", module)
//   .add("with text", () => (
//     <Button onClick={action("clicked")}>Hello Button</Button>
//   ))
//   .add("with some emoji", () => (
//     <Button onClick={action("clicked")}>😀 😎 👍 💯</Button>
//   ));
