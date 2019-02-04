import React from "react";
import animation from "./animation";
import theme from "./nightOwl";

export default function Slide({ time, lines }) {
  const styles = animation((time + 1) / 2, lines);
  return (
    <pre
      style={{
        backgroundColor: theme.plain.backgroundColor,
        color: theme.plain.color,
        overflow: "hidden",
        maxWidth: "978px",
        margin: "auto",
        padding: "10px"
      }}
    >
      {lines.map((line, i) => (
        <div
          style={Object.assign(
            { overflow: "hidden", height: "15px" },
            styles[i]
          )}
          key={line.key}
        >
          {line.tokens.map(token => {
            const props = theme.styles.find(s => s.types.includes(token.type));
            return <span {...props}>{token.content}</span>;
          })}
        </div>
      ))}
    </pre>
  );
}
