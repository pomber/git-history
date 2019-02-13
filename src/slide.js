import React from "react";
import animation from "./animation";
import theme from "./nightOwl";

const themeStylesByType = Object.create(null);
theme.styles.forEach(({ types, style }) => {
  types.forEach(type => {
    themeStylesByType[type] = Object.assign(
      themeStylesByType[type] || {},
      style
    );
  });
});

const Line = ({ line, style }) => (
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

export const Slide = ({ time, lines }) => {
  const styles = animation((time + 1) / 2, lines);
  return (
    <pre
      style={{
        backgroundColor: theme.plain.backgroundColor,
        color: theme.plain.color,
        width: "100%",
        overflow: "hidden",
        paddingTop: "100px",
        margin: 0
      }}
    >
      <code
        style={{
          display: "block",
          width: "calc(100% - 20px)",
          maxWidth: "900px",
          margin: "auto",
          padding: "10px"
        }}
      >
        {lines.map((line, i) => (
          <Line line={line} style={styles[i]} key={line.key} />
        ))}
      </code>
    </pre>
  );
};
