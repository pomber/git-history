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
        width: "100%",
        overflow: "hidden",
        marginTop: "100px"
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
          <div
            style={Object.assign(
              { overflow: "hidden", height: "15px" },
              styles[i]
            )}
            key={line.key}
          >
            {line.tokens.map((token, i) => {
              const props = theme.styles.find(s =>
                s.types.includes(token.type)
              );
              return (
                <span {...props} key={i}>
                  {token.content}
                </span>
              );
            })}
          </div>
        ))}
      </code>
    </pre>
  );
}
