import React, { useEffect, useState } from "react";
import { getSlides } from "./differ";
import useSpring from "react-use/lib/useSpring";
import Swipeable from "react-swipeable";
import { Slide } from "./slide";
import "./comment-box.css";

const CommitInfo = ({ commit, move, onClick }) => {
  const message = commit.message.split("\n")[0].slice(0, 80);
  const isActive = Math.abs(move) < 0.5;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        transform: `translateX(-50%) translateX(${250 * move}px)`,
        opacity: 1 / (1 + Math.min(0.8, Math.abs(move))),
        zIndex: !isActive && 2
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: "5px 0 15px"
        }}
        onClick={onClick}
      >
        {commit.author.avatar && (
          <img
            src={commit.author.avatar}
            alt={commit.author.login}
            height={40}
            width={40}
            style={{ borderRadius: "4px" }}
          />
        )}
        <div style={{ paddingLeft: "6px" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: "500" }}>
            {commit.author.login}
          </div>
          <div style={{ fontSize: "0.85rem", opacity: "0.9" }}>
            {isActive && commit.commitUrl ? (
              <a href={commit.commitUrl} target="_blank">
                on {commit.date.toDateString()}
              </a>
            ) : (
              `on ${commit.date.toDateString()}`
            )}
          </div>
        </div>
      </div>
      {isActive && (
        <div
          className="comment-box"
          title={commit.message}
          style={{ opacity: 1 - 2 * Math.abs(move) }}
        >
          {message}
          {message !== commit.message ? " ..." : ""}
        </div>
      )}
    </div>
  );
};

const CommitList = ({ commits, currentIndex, selectCommit }) => {
  const mouseWheelEvent = e => {
    selectCommit(currentIndex + (e.deltaX + e.deltaY) / 100);
  };
  return (
    <div
      onWheel={mouseWheelEvent}
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100px",
        position: "fixed",
        top: 0,
        background: "rgb(1, 22, 39)",
        zIndex: 1
      }}
    >
      {commits.map((commit, commitIndex) => (
        <CommitInfo
          commit={commit}
          move={commitIndex - currentIndex}
          key={commitIndex}
          onClick={() => selectCommit(commitIndex)}
        />
      ))}
    </div>
  );
};

export const History = ({ commits, language }) => {
  const codes = commits.map(commit => commit.content);
  const slideLines = getSlides(codes, language);
  return <Slides slideLines={slideLines} commits={commits} />;
};

const Slides = ({ commits, slideLines }) => {
  const [current, target, setTarget] = useSliderSpring(commits.length - 1);
  const setClampedTarget = newTarget =>
    setTarget(Math.min(commits.length - 0.75, Math.max(-0.25, newTarget)));

  const index = Math.round(current);
  const nextSlide = () => setClampedTarget(Math.round(target + 0.51));
  const prevSlide = () => setClampedTarget(Math.round(target - 0.51));
  useEffect(() => {
    document.body.onkeydown = e => {
      if (e.keyCode === 39) {
        nextSlide();
      } else if (e.keyCode === 37) {
        prevSlide();
      } else if (e.keyCode === 32) {
        setClampedTarget(current);
      }
    };
  });

  return (
    <React.Fragment>
      <CommitList
        commits={commits}
        currentIndex={current}
        selectCommit={index => setClampedTarget(index)}
      />
      <Swipeable onSwipedLeft={nextSlide} onSwipedRight={prevSlide}>
        <Slide time={current - index} lines={slideLines[index]} />
      </Swipeable>
    </React.Fragment>
  );
};

const useSliderSpring = initial => {
  const [target, setTarget] = useState(initial);
  const tension = 0;
  const friction = 10;
  const value = useSpring(target, tension, friction);
  return [Math.round(value * 100) / 100, target, setTarget];
};
