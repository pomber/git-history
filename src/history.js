import React, { useEffect, useState } from "react";
import { getSlides } from "./differ";
import { useSpring } from "react-use";
import Slide from "./slide";

export default function History({ commits, language }) {
  const codes = commits.map(commit => commit.content);
  const slideLines = getSlides(codes);
  const [current, target, setTarget] = useSliderSpring(codes.length - 1);
  const index = Math.round(current);

  const nextSlide = () =>
    setTarget(Math.min(Math.round(target + 0.51), slideLines.length - 1));
  const prevSlide = () => setTarget(Math.max(Math.round(target - 0.51), 0));
  useEffect(() => {
    document.body.onkeydown = function(e) {
      if (e.keyCode === 39) {
        nextSlide();
      } else if (e.keyCode === 37) {
        prevSlide();
      } else if (e.keyCode === 32) {
        setTarget(current);
      }
    };
  });
  return (
    <React.Fragment>
      <Slide time={current - index} lines={slideLines[index]} />
    </React.Fragment>
  );
}
function useSliderSpring(initial) {
  const [target, setTarget] = useState(initial);
  const tension = 0;
  const friction = 10;
  const value = useSpring(target, tension, friction);

  return [Math.round(value * 100) / 100, target, setTarget];
}
