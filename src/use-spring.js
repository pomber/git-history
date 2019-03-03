// based on https://github.com/streamich/react-use/blob/master/src/useSpring.ts
import { SpringSystem } from "rebound";
import { useState, useEffect } from "react";

export default function useSpring({
  target = 0,
  current = null,
  tension = 0,
  friction = 10
}) {
  const [spring, setSpring] = useState(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const listener = {
      onSpringUpdate: spring => {
        const value = spring.getCurrentValue();
        setValue(value);
      }
    };

    if (!spring) {
      const newSpring = new SpringSystem().createSpring(tension, friction);
      newSpring.setCurrentValue(target);
      setSpring(newSpring);
      newSpring.addListener(listener);
      return;
    }

    return () => {
      spring.removeListener(listener);
      setSpring(null);
    };
  }, [tension, friction]);

  useEffect(() => {
    if (spring) {
      spring.setEndValue(target);
      if (current != null) {
        spring.setCurrentValue(current);
      }
    }
  }, [target, current]);

  return value;
}
