import React from "react";

import useChildren from "./use-virtual-children";
import { Scrollbars } from "react-custom-scrollbars";

export default function Scroller({ items, getRow, getRowHeight, data }) {
  const [top, setTop] = React.useState(0);

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

  return (
    <Scrollbars
      autoHide
      ref={ref}
      // onScrollFrame={({ scrollTop }) => setTop(scrollTop)}
      onScroll={e => setTop(e.target.scrollTop)}
      renderThumbVertical={({ style, ...props }) => (
        <div
          style={{ ...style, backgroundColor: "rgb(173, 219, 103, 0.3)" }}
          {...props}
        />
      )}
      children={children}
    />
  );
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
