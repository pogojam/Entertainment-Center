import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import _ from "lodash";
import {
  useTransition,
  animated,
  useSpring,
  useSprings,
  config,
} from "react-spring";
import { StyledSceneCaption, StyledSceneHeading } from "./scene1.styles";

export const Scene1 = () => {
  const { opacity } = useSpring({
    opacity: 0,
  });

  useEffect(() => {
    opacity.start(1);
  }, []);

  return (
    <StyledSceneCaption>
      <StyledSceneHeading style={{ opacity }}>
        <h1 className="Name-2">Ryan</h1>
        <h1 className="Name-1"> Breaux</h1>
      </StyledSceneHeading>
      {/* <animated.div
        className={"Scene1-SubCaption"}
        style={{
          display: "flex",
          transform: anims[3].x.to((x, y, r) => {
            return `translate(${x}px,${y}px) rotate3d(0,0,1,${r}deg)`;
          }),
        }}
      >
        <FaBlackTie size="3.7em" style={{ color: "black" }} type="tie" />
        <p>Building digital products</p>
        <p>Tempe AZ In Tempe Arizona.</p>
      </animated.div> */}
    </StyledSceneCaption>
  );
};
