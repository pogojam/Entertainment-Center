import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
  useTransition,
  animated,
  useSpring,
  useSprings,
  config,
} from "react-spring";
import { useObserver } from "../../../hooks/useObserver";
import { Box, Heading } from "grommet";
import styled from "styled-components";
import Container from "../../../components/container/container";
// import { Projects } from "./projects/projects";

const buildThresholdList = (numSteps) => {
  let thresholds: Array<number> = [];

  for (let i = 1.0; i <= numSteps; i++) {
    let ratio = i / numSteps;
    thresholds.push(ratio);
  }

  thresholds.push(0);
  return thresholds;
};

const Background = animated(styled(Box)`
  left: 0;
  will-change: transform;
  min-height: ${({ windowHeight }) => windowHeight};
  background: #ff0000;
  position: absolute;
  transition: opacity 0.3s;

  z-index: 0;
  /* transform: matrix3d(1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); */

  transform: matrix3d(1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  @media (max-width: 600px) {
    transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
`);
const HeadingContainer = styled(Container)``;

export const Scene2 = ({ animation, ...props }) => {
  const [ref, entries] = useObserver({ threshold: buildThresholdList(40) });
  const [isActive, setActive] = useState(false);
  const animateProjects = useSpring(
    isActive
      ? { opacity: 1, transform: "scale(1)" }
      : { opacity: 0, transform: "scale(0)" }
  );
  const [appsAnim, setAppAnim] = useSprings(4, (i) => ({
    color: "rgba(51, 29, 43, 0.67)",
    rotate: [0],
    slide: [0],
  }));

  const [headingState, setHeading] = useState(true);

  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);
    }
  }, []);
  useEffect(() => {
    if (entries.intersectionRatio) {
      setAppAnim({
        rotate: [entries.intersectionRatio],
        slide: [(entries.intersectionRatio * 200) / 200],
      });
      if (entries.intersectionRatio > 0.6 && !isActive) {
        setActive(true);
      }
      if (entries.intersectionRatio < 0.6 && isActive) {
        setActive(false);
      }
    }
  }, [entries]);

  useEffect(() => {
    if (isActive) {
      setAppAnim((i) => {
        return {
          color: "rgba(51, 29, 43, 1)",
          slide: [0],
          delay: i * 200,
        };
      });
    }
  }, [isActive]);

  return (
    <Container
      animate
      ref={ref}
      style={{
        willChange: "transfrom, opacity",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
        ...props.style,
      }}
    >
      <Background
        className="scean2_Background"
        windowHeight={windowHeight}
        width={[windowHeight * 0.8 + "px", "100%"]}
        height={[windowHeight * 1.5 + "px"]}
        style={{
          transform: appsAnim[0].rotate.to(
            (e) =>
              `rotate(${
                e * -40
              }deg) matrix3d(1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)`
          ),
        }}
      />
      <HeadingContainer
        animate
        style={{
          transform: appsAnim[0].slide.to((x) => `translate(${x}px)`),
        }}
      >
        <Heading
          style={{
            width: "40%",
            position: "absolute",
            top: "-.2em",
            textAlign: "center",
            whiteSpace: "nowrap",
            margin: "auto",
            color: "bisque",
            transition: "opacity 1s",
            opacity: headingState ? 1 : 0,
          }}
        >
          {"Apps".split("").map((l, i) => (
            <animated.span
              style={{
                display: "inline-block",
                //@ts-ignore
                color: appsAnim[i],
              }}
            >
              {l}
            </animated.span>
          ))}
        </Heading>
      </HeadingContainer>
      <animated.div
        className={"Apps_Wrapper"}
        style={{
          marginLeft: "5vw",
          marginRight: "5vw",
          borderRadius: "26px",
          overflow: "hidden",

          maxHeight: "100%",
          ...animateProjects,
        }}
      >
        {/* <Projects setHeading={setHeading} /> */}
      </animated.div>
    </Container>
  );
};
