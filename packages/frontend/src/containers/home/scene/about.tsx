import _ from "lodash";
import Icon from "../../../icons";
import chance from "chance";
import { useObserver, buildThresholdList, useToggle } from "../../../util";
import { useSpring, animated, config, useSprings } from "react-spring";
import styled from "styled-components";
import React, {
  useEffect,
  useContext,
  useState,
  useReducer,
  useRef,
  useCallback,
} from "react";
import { PageState_Context } from "./context";
import { useScroll, useWheel } from "react-use-gesture";

const AboutStyles = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: ${({ windowHeight }) => windowHeight * 1.2 + "px"};
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    max-width: 500px;
    margin: 1em;
    border-radius: 29px;
    padding: 15px;
    backdrop-filter: blur(3px);
    color: white;
  }
`;

const Line = animated(styled.div`
  height: 16px;
  background-color: #b90000;
  width: "400px";
  transition: 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transform: ${({ show, index }) => {
    if (show) return "translate(0px,0px)";
    else return `translate(0px,${index % 2 === 1 ? "-50" : "50"}px)`;
  }};

  width: ${({ show }) => (show ? "100%" : "0%")};
`);

const TechIcons = React.memo(({ show }) => {
  const iconList = [
    "react",
    "rust",
    "docker",
    "node",
    "vim",
    "git",
    "mongo",
    "terminal",
  ];

  const colors = [
    "#85DCBE",
    "#C38D9E",
    "#41B2A3",
    "#553D67",
    "#f64C72",
    "#FC4445",
    "#CAFAFE",
  ];

  const paddingX = typeof window !== `undefined` ? window.innerWidth / 2 : 1000;
  const paddingY =
    typeof window !== `undefined` ? window.innerHeight / 2 : 1000;

  const springs = useSprings(
    iconList.length,
    iconList.map((name, i) => {
      const Chance = chance();
      let x = Chance.integer({ min: 100, max: paddingX });
      let y = Chance.integer({ min: 100, max: paddingY });
      const color = colors[Chance.integer({ min: 0, max: colors.length - 1 })];
      const o = Chance.floating({ min: 0.5, max: 0.9 });
      const scale = Chance.floating({ min: 1, max: 2.5 });
      const plusOrMinus = (num) => (Math.random() < 0.5 ? -num : num);

      return {
        reverse: !show,
        from: {
          transform: `translate(0px,0px) scale(1) rotate(3deg) `,
          color: "#000000",
          opacity: 0,
        },
        to: {
          transform: `translate(${plusOrMinus(x)}px,${plusOrMinus(
            y
          )}px)  scale(${scale}) rotate(${i * 10}deg) `,
          color: color,
          opacity: o,
        },
        config: { friction: 100, tension: 40 },
      };
    })
  );

  return springs.map((props, i) => (
    <animated.div
      style={{ ...props, left: "50%", top: "50%", position: "absolute" }}
    >
      <animated.div>
        <Icon size="5em" type={iconList[i]} />
      </animated.div>
    </animated.div>
  ));
});

export const About = () => {
  const [ref, entries] = useObserver({ threshold: buildThresholdList(40) });
  const [show, toggle] = useToggle(false);

  const [windowHeight, setWindowHeight] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);
    }
  }, []);

  // const [store, dispatch] = useContext(PageState_Context)

  const { transform, opacity } = useSpring(
    show
      ? {
          transform: `translate(0,0px)`,
          opacity: 1,
        }
      : {
          transform: `translate(0,300px)`,
          opacity: 0,
          config: config.molasses,
        }
  );

  useEffect(() => {
    const ir = entries.intersectionRatio;
    if (entries.intersectionRatio) {
      if (ir > 0.6 && !show) {
        toggle();
      }
      if (ir < 0.4 && show) {
        toggle();
      } else {
      }
    }
  }, [entries]);

  useEffect(() => {
    // if (show && store.active !== "about") {
    //   dispatch({ type: "SET_ACTIVE", input: "about" })
    // }
  }, [show]);

  return (
    <AboutStyles windowHeight={windowHeight} ref={ref}>
      <animated.div
        style={{
          opacity,
          transform,
          position: "relative",
        }}
      >
        <TechIcons show={show} />
        <Line index={1} show={show} />

        <animated.p>
          Big on design and lightning fast code. Found my love for JS developing
          on Node , leveraging the power of Non-Blocking I/O and npm’s rich
          package eco system. Out of necessity I first started learning web
          development in college when I started my first business selling
          clothing online through an e-commerce website. I have since learned
          more advanced techniques building tools for lead generation and
          business productivity.
        </animated.p>
        <Line index={2} show={show} />
      </animated.div>
    </AboutStyles>
  );
};
