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
      case "unsnap":
        return !prevState.snap ? prevState : { ...prevState, snap: false };
      case "change-area":
        if (snapAreas.length === 0) {
          return prevState;
        }

        const { changeIndex, recalculate } = action;
        const movingFromUnknownIndex = !prevState.snap || recalculate;

        // TODO memo
        const heights = items.map((item, i) => getRowHeight(item, i, data));

        let newIndex;
        if (movingFromUnknownIndex) {
          //todo memo
          const oldIndex = getAreaIndex(
            prevState.targetTop,
            snapAreas,
            heights,
            height
          );

          newIndex = changeIndex(snapAreas, oldIndex);
        } else {
          newIndex = changeIndex(snapAreas, prevState.areaIndex);
        }

        if (newIndex === prevState.areaIndex && !movingFromUnknownIndex) {
          return prevState;
        }

        // TODO  memo
        let contentHeight = heights.reduce((a, b) => a + b, 0);

        const targetTop = getScrollTop(
          snapAreas[newIndex],
          contentHeight,
          height,
          heights
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
        // console.log("manual scroll", newTop);
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

  // Auto-scroll to closest change when changing versions:
  // React.useLayoutEffect(() => {
  //   dispatch({
  //     type: "change-area",
  //     recalculate: true,
  //     changeIndex: closestIndex
  //   });
  // }, [snapAreas]);

  React.useEffect(() => {
    dispatch({
      type: "unsnap"
    });
  }, [snapAreas]);

  React.useLayoutEffect(() => {
    if (snap) {
      ref.current.scrollTop = top;
    }
  }, [snap, top]);

  return (
    <div
      style={{
        height: "100%",
        width: "fit-content",
        overflowY: "auto",
        overflowX: "scroll"
      }}
      className="scroller"
      ref={ref}
      onScroll={e => {
        const newTop = e.target.scrollTop;
        if (newTop === top) {
          return;
        }
        dispatch({ type: "manual-scroll", newTop });
      }}
    >
      <code
        style={{
          display: "block",
          //width: "calc(100% - 20px)",
          width: "100%",
          //maxWidth: "900px",
          margin: "auto",
          padding: "10px",
          boxSizing: "border-box",
          height: "100%"
        }}
        children={children}
      />
    </div>
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
  areaCenters.unshift(0);
  for (let a = 0; a < areas.length; a++) {
    if (middleRow < areaCenters[a + 1]) {
      return (
        a -
        (areaCenters[a + 1] - middleRow) / (areaCenters[a + 1] - areaCenters[a])
      );
    }
  }

  return areas.length - 0.9;
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
