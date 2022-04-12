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
  hasLoaded = false;

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
    background-color: #dc1212;
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

const GlassOverLay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #13141454;
  z-index: 9;
  backdrop-filter: blur(9px);
  pointer-events: none;
`;

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

  useEffect(() => {
    if (progress === 100) {
      BackgroundState.setLoadState(true);
    }
  }, [progress]);

  return (
    <>
      {/* <GlassOverLay /> */}
      <Canvas id="Background_Canvas" dpr={[1, 2]}>
        {transitions(
          (props, items) =>
            !BackgroundState.hasLoaded && (
              <Loader style={props} progress={progress} />
            )
        )}
        <Suspense fallback={<></>}>
          <ScrollControls
            pages={0} // Each page takes 100% of the height of the canvas
            distance={1} // A factor that increases scroll bar travel (default: 1)
            damping={4} // Friction, higher is faster (default: 4)
            horizontal={false} // Can also scroll horizontally (default: false)
            infinite={false} // Can also scroll infinitely (default: false)
          >
            {/* <PerspectiveCaera ref={cameraRef} /> */}
            {/* <OrbitControls /> */}
            {children}
          </ScrollControls>
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
