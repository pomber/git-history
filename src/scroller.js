import React from "react";
import useChildren from "./use-virtual-children";
import "./scroller.css";

export default function Scroller({
  items,
  getRow,
  getRowHeight,
  data,
  top,
  setTop
}) {
  const ref = React.useRef(null);
  const height = useHeight(ref);

  const children = useChildren({
    height,
    top,
    items,
    getRow,
    getRowHeight,
    data
  });

  React.useLayoutEffect(() => {
    ref.current.scrollTop = top;
  }, [top]);

  return (
    <div
      style={{ height: "100%", overflowY: "auto" }}
      class="scroller"
      ref={ref}
      onScroll={e => setTop(e.target.scrollTop)}
      children={children}
    />
  );
}

function useHeight(ref) {
  let [height, setHeight] = React.useState(null);

  function handleResize() {
    setHeight(ref.current.clientHeight);
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
