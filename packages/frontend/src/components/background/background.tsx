import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import {
  Cloud,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  Scroll,
  ScrollControls,
  Sphere,
  Stars,
  useAspect,
  useFBO,
  useScroll,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import styled from "styled-components";
import "../../materials/customMaterial";
import {
  Texture,
  TextureLoader,
  CatmullRomCurve3,
  MathUtils,
  Vector3,
  DoubleSide,
  ImageLoader,
  Color,
} from "three";

import Planet from "./Planet";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  GodRays,
} from "@react-three/postprocessing";
import { animated, config, useSpring } from "@react-spring/three";
import vertex from "../../shaders/vertex.shader.glsl?raw";
import frag from "../../shaders/frag.shader.glsl?raw";
import { lerp } from "three/src/math/MathUtils";

const StyledBackground = styled.div`
  .background_html_scroll {
    will-change: transform;
    width: 100%;
  }
  height: 100%;

  #Background_Canvas {
    background-color: #0000000a;
    transition: background-color 0.8s linear;
  }
`;

const StarGroup = () => {
  const ref = useRef<any>();

  const [checkpoint, setCheckpoint] = useState(false);
  const renderer = useThree();
  const scroll = useScroll();
  const { color } = useSpring({ color: 0, loop: true });

  useFrame(() => {
    const scrollLimit = scroll.range(0, 1 / 3);
    const canvasNode = document.getElementById("Background_Canvas");
    if (canvasNode) {
      if (scrollLimit > 0.8) {
        canvasNode.style.backgroundColor = "rgba(0, 0, 0, .95)";
      } else {
        canvasNode.style.backgroundColor = "rgba(0, 0, 0, 0)";
      }
    }
  });
  return (
    <Stars
      radius={100} // Radius of the inner sphere (default=100)
      depth={2} // Depth of area where stars should fit (default=50)
      count={10000} // Amount of stars (default=5000)
      factor={13} // Size factor (default=4)
      saturation={0.4} // Saturation 0-1 (default=0)
      fade
      ref={ref}
    />
  );
};

const AnimatedPlane = animated(Plane);

const OrbGroup = () => {
  const scroll = useScroll();
  const planeRef = useRef();
  const img = useTexture(
    "https://res.cloudinary.com/dxjse9tsv/image/upload/v1589865954/01.jpg"
  );
  const { position, rotation } = useSpring({
    rotation: [0, 0, 0],
    position: [0, -27, -120],
    config: config.molasses,
  });
  useFrame((e) => {
    const xVal = scroll.range(0, 1 / 3) * -5;
    const yVal = scroll.range(0, 1 / 3) * 28 - 28;
    const zVal = scroll.range(0, 1 / 3) * -100;

    // position.start([0, yVal, zVal]);
    // rotation.set([0, 0, 0]);

    if (planeRef.current) {
      planeRef.current.position.y = yVal;
      planeRef.current.position.z = zVal;

      planeRef.current.material.uniforms.crossAxis.value = e.mouse.x;
      planeRef.current.material.uniforms.time.value = e.clock.elapsedTime;
      planeRef.current.material.uniforms.scale.value = MathUtils.lerp(
        planeRef.current.material.uniforms.scale.value,
        MathUtils.clamp(scroll.range(0, 1 / 3), 0, 0.16),
        0.3
      );
      planeRef.current.material.uniforms.shift.value = MathUtils.lerp(
        planeRef.current.material.uniforms.shift.value,
        scroll.range(0, 1),
        0.3
      );
    }
  });

  const size = useAspect(1800, 1000);
  const [video] = useState(() => {
    const vid = document.createElement("video");
    vid.src =
      "https://res.cloudinary.com/dxjse9tsv/video/upload/v1577049569/video/homeApp_edited.mp4";
    vid.muted = true;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    return vid;
  });

  const uniforms = useMemo(
    () => ({
      planeTexture: { value: img },
      hasTexture: { value: 1 },
      scale: { value: 0 },
      shift: { value: 0 },
      crossAxis: { value: 0 },
      opacity: { value: 1 },
      color: { value: new Color("white") },
      time: { value: 0 },
    }),
    []
  );

  // Keep in mind videos can only play once the user has interacted with the site ...
  useEffect(() => void video.play(), [video]);
  return (
    <AnimatedPlane
      ref={planeRef}
      rotation={rotation.to((...p) => p)}
      args={[100, 40, 60, 60]}
      position={position.to((...p) => p)}
    >
      <shaderMaterial
        attach="material"
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={frag}
      />
      {/* <customMaterial attach="material" color={"white"} map={img} /> */}
    </AnimatedPlane>
  );
};

const CloudGroup = () => {
  return (
    <group position={[0, -0.43, -11.35]}>
      <Cloud depth={10} position={[-4, -2, 0]} args={[3, 2]} />
    </group>
  );
};

const Setup = ({ children }) => {
  const cameraRef = useRef(null);

  return (
    <Canvas
      id="Background_Canvas"
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, -3.2, 40], fov: 12 }}
    >
      <ScrollControls pages={8}>
        {/* <OrbitControls enableZoom={false} /> */}
        <PerspectiveCamera ref={cameraRef} />
        {children}
      </ScrollControls>
    </Canvas>
  );
};

export const Background = ({ children }) => {
  return (
    <StyledBackground>
      <Setup>
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 5, 2]} intensity={1} />
        <Scroll>
          <StarGroup />
          <OrbGroup />
          {/* <CloudGroup /> */}
          {/* <Planet /> */}
        </Scroll>
        <Scroll class={"background_html_scroll"} html>
          <div className="Content-Container">{children}</div>
        </Scroll>
      </Setup>
    </StyledBackground>
  );
};
