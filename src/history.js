import React, { useEffect, useState } from "react";
import { getSlides } from "./differ";
import { useSpring } from "react-use";
import Slide from "./slide";

function CommitInfo({ commit }) {
  const message = commit.message.split("\n")[0].slice(0, 80);
  return (
    <div
      style={{
        height: "50px",
        width: "200px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <img
        src={commit.author.avatar}
        height={40}
        width={40}
        style={{ borderRadius: "4px" }}
      />
      <div style={{ paddingLeft: "6px" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>
          {commit.author.login}
        </div>
        <div style={{ fontSize: "0.85rem", opacity: "0.9" }}>
          on {commit.date.toDateString()}
        </div>
      </div>
      {/* <div title={commit.message}>
        {message}
        {message !== commit.message ? "..." : ""}
      </div> */}
    </div>
  );
}

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
      <CommitInfo commit={commits[index]} />
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
