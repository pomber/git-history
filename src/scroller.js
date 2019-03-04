import React from "react";
import useChildren from "./use-virtual-children";
import "./scroller.css";
import useSpring from "./use-spring";
import { nextIndex, prevIndex, getScrollTop } from "./utils";

const initialState = {
  snap: false,
  targetTop: 0,
  currentTop: 0,
  areaIndex: 0
};

export default function Scroller({
  items,
  getRow,
  getRowHeight,
  data,
  snapAreas
}) {
  const ref = React.useRef();
  const height = useHeight(ref);

  const reducer = (prevState, action) => {
    switch (action.type) {
      case "change-area":
        if (snapAreas.length === 0) {
          return prevState;
        }

        const { changeIndex } = action;

        // TODO memo
        const heights = items.map((item, i) => getRowHeight(item, i, data));

        let newIndex;
        if (prevState.snap) {
          newIndex = changeIndex(snapAreas, prevState.areaIndex);
        } else {
          //todo memo
          const oldIndex = getAreaIndex(
            prevState.currentTop,
            snapAreas,
            heights,
            height
          );

          console.log(snapAreas, prevState.currentTop);
          newIndex = changeIndex(snapAreas, oldIndex);
        }

        if (newIndex === prevState.areaIndex && prevState.snap) {
          return prevState;
        }

        // TODO  memo
        let contentHeight = heights.reduce((a, b) => a + b, 0);

        const targetTop = getScrollTop(
          snapAreas[newIndex],
          contentHeight,
          height
        );

        return {
          ...prevState,
          areaIndex: newIndex,
          snap: true,
          currentTop: null,
          targetTop
        };
      case "manual-scroll":
        const { newTop } = action;
        if (newTop === prevState.currentTop && !prevState.snap) {
          return prevState;
        }
        console.log("manual scroll", newTop);
        return {
          ...prevState,
          snap: false,
          currentTop: newTop,
          targetTop: newTop
        };
      default:
        throw Error();
    }
  };

  const [{ snap, targetTop, currentTop }, dispatch] = React.useReducer(
    reducer,
    initialState
  );

  const top = useSpring({
    target: targetTop,
    current: currentTop,
    round: Math.round
  });
  // console.log("render", targetTop, top);

  const children = useChildren({
    height,
    top,
    items,
    getRow,
    getRowHeight,
    data
  });

  React.useEffect(() => {
    document.body.addEventListener("keydown", e => {
      if (e.keyCode === 38) {
        dispatch({ type: "change-area", changeIndex: prevIndex });
        e.preventDefault();
      } else if (e.keyCode === 40) {
        dispatch({ type: "change-area", changeIndex: nextIndex });
        e.preventDefault();
      }
    });
  }, []);

  React.useLayoutEffect(() => {
    if (snap) {
      ref.current.scrollTop = top;
    }
  }, [snap, top]);

  return (
    <div
      style={{ height: "100%", overflowY: "auto", overflowX: "hidden" }}
      className="scroller"
      ref={ref}
      onScroll={e => {
        const newTop = e.target.scrollTop;
        if (newTop === top) {
          return;
        }
        dispatch({ type: "manual-scroll", newTop });
      }}
      children={children}
    />
  );
}

function getAreaIndex(scrollTop, areas, heights, containerHeight) {
  if (areas.length === 0) {
    return 0;
  }

  const scrollMiddle = scrollTop + containerHeight / 2;

  let h = 0;
  let i = 0;
  while (scrollMiddle > h) {
    h += heights[i++];
  }
  const middleRow = i;

  const areaCenters = areas.map(a => (a.start + a.end) / 2);
  for (let a = 0; a < areas.length; a++) {
    if (middleRow < areaCenters[a]) {
      return a - 0.5;
    } else if (middleRow === areaCenters[a]) {
      return a;
    }
  }

  return areas.length - 0.5;
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
  }, []);

  return height;
}
