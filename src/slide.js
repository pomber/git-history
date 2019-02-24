import React from "react";
import animation from "./animation";
import theme from "./nightOwl";
import Scroller from "./scroller";

const themeStylesByType = Object.create(null);
theme.styles.forEach(({ types, style }) => {
  types.forEach(type => {
    themeStylesByType[type] = Object.assign(
      themeStylesByType[type] || {},
      style
    );
  });
});

function Line({ line, style }) {
  return (
    <div style={Object.assign({ overflow: "hidden", height: "15px" }, style)}>
      {line.tokens.map((token, i) => {
        const style = themeStylesByType[token.type] || {};
        return (
          <span style={style} key={i}>
            {token.content}
          </span>
        );
      })}
    </div>
  );
}

function getLineHeight(line, i, { styles }) {
  return styles[i].height != null ? styles[i].height : 15;
}

function getLine(line, i, { styles }) {
  return <Line line={line} style={styles[i]} key={line.key} />;
}

export default function Slide({ time, lines }) {
  const styles = animation((time + 1) / 2, lines);
  return (
    <pre
      style={{
        backgroundColor: theme.plain.backgroundColor,
        color: theme.plain.color,
        paddingTop: "100px",
        margin: 0,
        height: "100%",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <code
        style={{
          display: "block",
          width: "calc(100% - 20px)",
          maxWidth: "900px",
          margin: "auto",
          padding: "10px",
          height: "100%",
          boxSizing: "border-box"
        }}
      >
        <Scroller
          items={lines}
          getRow={getLine}
          getRowHeight={getLineHeight}
          data={{ styles }}
        />
      </code>
    </pre>
  );
}
