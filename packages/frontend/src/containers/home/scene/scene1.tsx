import { useEffect, useLayoutEffect, useRef } from "react";
import { animated, useSpring, config } from "react-spring";
import { StyledSceneCaption, StyledSceneHeading } from "./scene1.styles";
import { useFrame } from "@react-three/fiber";
import { NavState } from "../../../components/nav";
import { Page } from "../../../components/page/page";

export const Scene1 = ({ style }) => {
  const { opacity, header } = useSpring({
    opacity: 0,
    header: [0.3, 0.3, 1],
  });
  const conRef = useRef(null);
  // useFrame((e) => {
  //   header.start([e.mouse.x * -0.5, e.mouse.y], {
  //     config: config.stiff,
  //   });
  // });
  const setNavPos = (observer) => {
    const [{ target }] = observer;
    const { top, height } = target.getBoundingClientRect();
    const shift = top + height;

    NavState.setTopPos(shift > 0 ? shift : window.innerHeight * 0.55);
    NavState.setTopPos(shift > 0 ? shift : window.innerHeight * 0.55);
  };
  useLayoutEffect(() => {
    opacity.start(1, { config: { duration: 2000 } });
    NavState.setShouldShow(true);
    const observer = new ResizeObserver(setNavPos);
    if (conRef.current) {
      observer.observe(conRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Page index={0}>
      <StyledSceneCaption>
        <StyledSceneHeading
          id={"HomeContainer-Heading"}
          ref={conRef}
          style={{ opacity: style.opacity }}
        >
          <animated.h1
            // style={{
            //   textShadow: header.to(
            //     (x, y) => `${x * 13}px ${y * 13}px ${2}px #a8a3ed`
            //   ),
            //   transform: header.to((v, p, s) => `scale(${s})`),
            // }}
            className="Name-2"
          >
            Ryan Breaux
          </animated.h1>
          {/* <animated.h1
            // style={{
            //   textShadow: header.to(
            //     (x, y) => `${x * 13}px ${y * 13}px ${2}px #a8a3ed`
            //   ),
            //   transform: header.to((v, p, s) => `scale(${s})`),
            // }}
            className="Name-1"
          >
            Breaux
          </animated.h1> */}
        </StyledSceneHeading>
        {/* <animated.div
        className={"Scene1-SubCaption"}
        style={{
          display: "flex",
        }}
      >
        <p>Building digital products in Phoenix AZ.</p>
      </animated.div> */}
      </StyledSceneCaption>
    </Page>
  );
};
