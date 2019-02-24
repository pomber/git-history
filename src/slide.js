import React from "react";
import animation from "./animation";
import theme from "./nightOwl";
import useChildren from "./useVirtualChildren";
import { Scrollbars } from "react-custom-scrollbars";

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

function Lines({ height, top, lines, styles }) {
  const children = useChildren({
    height,
    top,
    items: lines,
    getRow: getLine,
    getRowHeight: getLineHeight,
    data: { styles }
  });
  return children;
}

function useHeight(ref) {
  let [height, setHeight] = React.useState(null);

  function handleResize() {
    setHeight(ref.current.getClientHeight());
  }

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref.current]);

  return height;
}

function Slide({ lines, styles }) {
  const [top, setTop] = React.useState(0);

  let ref = React.useRef(null);
  let height = useHeight(ref);

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
      <Scrollbars
        autoHide
        ref={ref}
        onScrollFrame={({ scrollTop }) => setTop(scrollTop)}
        renderThumbVertical={({ style, ...props }) => (
          <div
            style={{ ...style, backgroundColor: "rgb(173, 219, 103, 0.3)" }}
            {...props}
          />
        )}
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
          <Lines height={height} top={top} lines={lines} styles={styles} />
        </code>
      </Scrollbars>
    </pre>
  );
}

export default function SlideWrapper({ time, lines }) {
  const styles = animation((time + 1) / 2, lines);
  return <Slide styles={styles} lines={lines} />;
}
