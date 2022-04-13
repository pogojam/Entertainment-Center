import {
  Html,
  OrbitControls,
  PerspectiveCamera,
  ScrollControls,
  Stars,
  useProgress,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { DoubleSide } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import "../../materials/customMaterial";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { makeAutoObservable } from "mobx";
import { Meter } from "grommet";
import { config, useTransition } from "@react-spring/three";
import { animated } from "react-spring";

class State {
  hasLoaded = true;

  constructor() {
    makeAutoObservable(this);
  }
  setLoadState(state) {
    this.hasLoaded = state;
  }
}

export const BackgroundState = new State();

const StyledBackground = styled.div`
  .background_html_scroll {
    will-change: transform;
    width: 100%;
    position: relative;
  }
  height: 100%;

  #Background_Canvas {
    background: radial-gradient(
      at 50% 100%,
      #873740 0%,
      #272730 40%,
      #171720 80%,
      #070710 100%
    );

    transition: background-color 0.8s linear;
  }
`;

const StyledLoader = styled(animated.div)`
  width: 36vw;
  padding-bottom: 7px;
  font-family: "break";
  font-weight: 900;
  letter-spacing: 5px;
`;

function Loader({ progress, style }) {
  return (
    <Html center>
      <StyledLoader style={style}>
        Loading
        <Meter
          color="black"
          thickness="xsmall"
          size="xlarge"
          values={[
            {
              value: progress,
              label: "sixty",
            },
          ]}
          aria-label="meter"
        ></Meter>
      </StyledLoader>
    </Html>
  );
}

const About = () => {
  const data = useLoader(
    SVGLoader,
    "https://res.cloudinary.com/dxjse9tsv/image/upload/v1540234014/graphql.svg"
  );
  const shapes = useMemo(
    () =>
      data.paths.flatMap((g, index) =>
        g.toShapes(true).map((shape) => ({ shape, color: g.color, index }))
      ),
    [data]
  );
  return (
    <>
      {shapes.map(({ shape }) => (
        <mesh scale={[0.01, 0.01, 0.01]}>
          <meshPhongMaterial
            side={DoubleSide}
            color={"red"}
            depthWrite={false}
            transparent
          />
          <shapeGeometry args={[shape]} />
        </mesh>
      ))}
    </>
  );
};

const SetupCanvas = ({ children }) => {
  const cameraRef = useRef(null);
  const { active, progress, loaded } = useProgress();

  const transitions = useTransition(progress, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 200,
    config: config.molasses,
  });

  return (
    <>
      <Canvas id="Background_Canvas" dpr={[1, 2]}>
        <Suspense fallback={<></>}>
          {/* <PerspectiveCaera ref={cameraRef} /> */}
          {/* <OrbitControls /> */}
          {children}
        </Suspense>
      </Canvas>
    </>
  );
};

export const Background = ({ children }) => {
  return (
    <StyledBackground>
      <SetupCanvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        {children}
      </SetupCanvas>
    </StyledBackground>
  );
};
