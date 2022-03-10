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
import {
  StyledSceneContainer,
  StyledSceneCaption,
  StyledSceneHeading,
  StyledParagraph,
} from "./scene1.styles";
import { FaBlackTie } from "react-icons/fa";
import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export const generateKey = (pre) => {
  return `${pre}_${new Date().getTime()}`;
};

export const Scene1 = () => {
  const captions = [...Array(4)];
  const [location, setLocation] = useState(false);
  const scrollData = useScroll();
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);
      window.dispatchEvent(new Event("resize"));
    }
  }, []);

  const calc = (transform, index, p) => {
    if (window) {
      switch (transform) {
        case "r":
          if (index === 2) return p * -10;
          return 0;
        case "y":
          if (index === 2) return p * 200;
          if (location && index === 1) return;
          return p * window.innerHeight * 0.7;
        case "x":
          if (index == 3 || index === 2) {
            return 0;
          } else {
            return 0;
          }
        case "o":
          if (window.innerWidth < 600) return 1 - p;
          if (index === 2 || index === 1) {
            return 1 - p;
          } else {
            return 1;
          }
      }
    }
  };

  const isMobile =
    typeof window === "undefined" ? true : window.innerWidth < 600;

  const [anims, setAnim] = useSprings(captions.length, () => ({
    x: isMobile ? [0, -200, 0] : [0, 0, 0],
    opacity: 1,
    color: "#000000",
    config: config.molasses,
  }));

  const transitionHeading = useTransition(location, {
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const [showStroke, setStroke] = useState(false);
  const scrollEvent = useCallback(() => {
    if (window) {
      const maxDis = window.innerHeight * 0.8;
      const tieY = 300;
      const percentAnimated = scrollData.range(0, 1 / 2);

      if (!location && percentAnimated < 3) {
        //@ts-ignore
        setAnim.start((i) => ({
          x: [
            calc("x", i, percentAnimated),
            window.innerWidth < 600
              ? //@ts-ignore
                calc("y", i, percentAnimated) - 200
              : calc("y", i, percentAnimated),
            calc("r", i, percentAnimated),
          ],
          color: percentAnimated > 0.3 ? "#ffffff" : "#000000",
          opacity: calc("o", i, percentAnimated),
        }));
      }
      if (!location && percentAnimated > 1.6) {
        console.log(percentAnimated);
        setLocation(true);
      }

      if (location && percentAnimated < 1.6) {
        setStroke(false);
        setLocation(false);
      }
    }
  }, []);

  useFrame(scrollEvent);

  useLayoutEffect(() => {
    if (scrollData.el) {
      // scrollData.el.addEventListener("scroll", scrollEvent);
    }
  }, []);
  const strokeAnim = useSpring(showStroke ? { offset: 0 } : { offset: 300 });

  return (
    <StyledSceneCaption
      style={{
        opacity: anims[2].opacity.to((e) => e),
      }}
    >
      <StyledSceneHeading
        style={{
          transform: anims[2].x.to(
            (x, y, r) => `translate(${x}px,${y}px) rotate3d(0,0,1,${r}deg)`
          ),
        }}
      >
        <span>Ryan</span>
        <span> Breaux</span>
      </StyledSceneHeading>
      <animated.div
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
      </animated.div>
    </StyledSceneCaption>
  );
};
