import {
  OrbitControls,
  PerspectiveCamera,
  ScrollControls,
} from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { DoubleSide } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import "../../materials/customMaterial";

const StyledBackground = styled.div`
  .background_html_scroll {
    will-change: transform;
    width: 100%;
  }
  height: 100%;

  #Background_Canvas {
    background-color: #00000053;
    transition: background-color 0.8s linear;
  }
`;

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

  return (
    <Canvas
      id="Background_Canvas"
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 3.2, 40], fov: 12 }}
    >
      <ScrollControls
        pages={0} // Each page takes 100% of the height of the canvas
        distance={1} // A factor that increases scroll bar travel (default: 1)
        damping={4} // Friction, higher is faster (default: 4)
        horizontal={false} // Can also scroll horizontally (default: false)
        infinite={false} // Can also scroll infinitely (default: false)
      >
        {/* <OrbitControls enableZoom={true} /> */}
        <PerspectiveCamera ref={cameraRef} />
        {children}
      </ScrollControls>
    </Canvas>
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
