import { useEffect, useLayoutEffect, useRef } from "react";
import { animated, useSpring, config } from "react-spring";
import { StyledSceneCaption, StyledSceneHeading } from "./scene1.styles";
import { useFrame } from "@react-three/fiber";
import { Page } from "../../../components/page/page";
import { BackgroundState } from "../../../components/background/background";
import { observer } from "mobx-react";
import { useStore } from "../../../models";
import { types } from "mobx-state-tree";
import { NavBar } from "../../../components/nav";
import { BsLinkedin, BsMedium } from "react-icons/bs";
import {
  AiFillMediumSquare,
  AiFillLinkedin,
  AiFillTwitterSquare,
} from "react-icons/ai";

export const Scene1 = observer(({ style }) => {
  const { opacity, header } = useSpring({
    opacity: 0,
    header: [0.3, 0.3, 1],
  });
  const conRef = useRef(null);
  const headingRef = useRef(null);

  useLayoutEffect(() => {
    if (BackgroundState.hasLoaded) {
      opacity.start(1, { config: { duration: 2000 } });
    }
  }, [BackgroundState.hasLoaded]);

  return (
    <Page index={0}>
      <StyledSceneCaption ref={conRef}>
        <StyledSceneHeading
          id={"HomeContainer-Heading"}
          ref={headingRef}
          style={{ opacity: BackgroundState.hasLoaded ? style.opacity : 0 }}
        >
          <animated.h1>Ryan Breaux</animated.h1>
          <NavBar />
        </StyledSceneHeading>
      </StyledSceneCaption>
    </Page>
  );
});
