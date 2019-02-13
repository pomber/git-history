import { createAnimation, Stagger } from "./airframe/airframe";
import easing from "./airframe/easing";

/* eslint-disable */

const dx = 250;

/* @jsx createAnimation */

// window.LOG = "verbose";

const SlideToLeft = () => (
  <tween
    from={{ x: 0, opacity: 1 }}
    to={{ x: -dx, opacity: 0 }}
    ease={easing.easeInQuad}
  />
);

const ShrinkHeight = () => (
  <tween from={{ height: 15 }} to={{ height: 0 }} ease={easing.easeInOutQuad} />
);

const SlideFromRight = () => (
  <tween
    from={{ x: dx, opacity: 0 }}
    to={{ x: 0, opacity: 1 }}
    ease={easing.easeOutQuad}
  />
);
const GrowHeight = () => (
  <tween from={{ height: 0 }} to={{ height: 15 }} ease={easing.easeInOutQuad} />
);

const SwitchLines = ({ filterExit, filterEnter }) => (
  <parallel>
    <Stagger interval={0.2} filter={filterExit}>
      <chain durations={[0.35, 0.3, 0.35]}>
        <SlideToLeft />
        <ShrinkHeight />
      </chain>
    </Stagger>
    <Stagger interval={0.2} filter={filterEnter}>
      <chain durations={[0.35, 0.3, 0.35]}>
        <delay />
        <GrowHeight />
        <SlideFromRight />
      </chain>
    </Stagger>
  </parallel>
);

export default (
  <chain durations={[0.5, 0.5]}>
    <SwitchLines
      filterExit={line => line.left && !line.middle}
      filterEnter={line => !line.left && line.middle}
    />
    <SwitchLines
      filterExit={line => line.middle && !line.right}
      filterEnter={line => !line.middle && line.right}
    />
  </chain>
);
