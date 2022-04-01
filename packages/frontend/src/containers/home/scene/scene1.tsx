import { useEffect, useLayoutEffect, useRef } from "react";
import { animated, useSpring, config } from "react-spring";
import { StyledSceneCaption, StyledSceneHeading } from "./scene1.styles";
import { useFrame } from "@react-three/fiber";
import { NavState } from "../../../components/nav";
import { Page } from "../../../components/page/page";
import { BackgroundState } from "../../../components/background/background";
import { observer } from "mobx-react";

export const Scene1 = observer(({ style }) => {
  const { opacity, header } = useSpring({
    opacity: 0,
    header: [0.3, 0.3, 1],
  });
  const conRef = useRef(null);
  const headingRef = useRef(null);
  // useFrame((e) => {
  //   header.start([e.mouse.x * -0.5, e.mouse.y], {
  //     config: config.stiff,
  //   });
  // });
  const setNavPos = (nodeObserver) => {
    const target = headingRef.current;
    const { top, height } = target.getBoundingClientRect();
    const shift = top + height;

    NavState.setTopPos(shift > 0 ? shift : window.innerHeight * 0.55);
    NavState.setTopPos(shift > 0 ? shift : window.innerHeight * 0.55);
  };

  useLayoutEffect(() => {
    if (BackgroundState.hasLoaded) {
      opacity.start(1, { config: { duration: 2000 } });

      setTimeout(() => {
        NavState.setShouldShow(true);
      }, 500);
    }

    const nodeObserver = new ResizeObserver(setNavPos);
    if (conRef.current) {
      nodeObserver.observe(conRef.current);
    }
    return () => {
      nodeObserver.disconnect();
    };
  }, [BackgroundState.hasLoaded]);

  return (
    <Page index={0}>
      <StyledSceneCaption ref={conRef}>
        <StyledSceneHeading
          id={"HomeContainer-Heading"}
          ref={headingRef}
          style={{ opacity: BackgroundState.hasLoaded ? style.opacity : 0 }}
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
});
