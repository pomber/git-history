import React from "react";
import { storiesOf } from "@storybook/react";
import useSpring from "./use-spring";

function Test() {
  const [{ target, current }, setState] = React.useState({
    target: 0,
    current: null
  });
  const value = useSpring({ target, current });

  return (
    <div>
      <div style={{ display: "flex" }}>
        <span style={{ flex: 0.3 }}>Target</span>
        <input
          value={target}
          onChange={e =>
            setState({
              target: +e.target.value,
              current: null
            })
          }
          style={{ flex: 1 }}
          type="range"
        />
        <span style={{ flex: 0.3 }}>{target}</span>
      </div>
      <div style={{ display: "flex" }}>
        <span style={{ flex: 0.3 }}>Current</span>
        <input
          value={current}
          onChange={e =>
            setState({
              target: +e.target.value,
              current: +e.target.value
            })
          }
          style={{ flex: 1 }}
          type="range"
        />
        <span style={{ flex: 0.3 }}>{current}</span>
      </div>
      <div style={{ display: "flex" }}>
        <span style={{ flex: 0.3 }}>Value</span>
        <input value={value} type="range" readOnly style={{ flex: 1 }} />
        <span style={{ flex: 0.3 }}>{Math.round(value * 1000) / 1000}</span>
      </div>
    </div>
  );
}

storiesOf("useSpring", module).add("test", () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "90vh"
    }}
  >
    <div style={{ width: "60%" }}>
      <Test />
    </div>
  </div>
));
