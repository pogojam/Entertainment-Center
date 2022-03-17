//@ts-noCheck
import { a, animated, config, useSpring } from "@react-spring/three";
import { Plane, useAspect, useScroll, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { Color, Vector2, MathUtils } from "three";
import "../../materials/customMaterial";
import frag from "../../shaders/frag.shader.glsl?raw";
import vertex from "../../shaders/vertex.shader.glsl?raw";

const AnimatedPlane = animated(Plane);

export const WarpedPlane = memo(() => {
  const scroll = useScroll();
  const planeRef = useRef();
  const [isOutOfWindow, setIsoutOfwindow] = useState(false);
  const img = useTexture(
    "https://res.cloudinary.com/dxjse9tsv/image/upload/v1589865954/01.jpg"
  );

  const initPlaneSize = [15, 15, 100, 100];
  const initPlanePosition = [0, 0, 0];
  const initPlaneRotation = [0, 0, 0];

  const { position, rotation, mouse, intensity } = useSpring({
    rotation: initPlaneRotation,
    position: initPlanePosition,
    intensity: 0.0,
    mouse: [0, 0],
    config: config.molasses,
  });

  useLayoutEffect(async () => {
    await intensity.start(1.3, {
      config: {
        velocity: 0,
        mass: 1,
        tension: 1,
        friction: 15,
      },
    });
    await intensity.start(3.3, {
      config: {
        velocity: 0,
        mass: 1,
        tension: 3,
        friction: 15,
      },
    });
  }, []);

  useFrame((e) => {
    if (!isOutOfWindow) {
      mouse.start([e.mouse.x, e.mouse.y]);
    } else {
      mouse.start([0, 0]);
    }

    if (planeRef.current) {
      // planeRef.current.position.y = yVal;
      // planeRef.current.position.z = zVal;
      // planeRef.current.material.uniforms.crossAxis.value = e.mouse.x;
      planeRef.current.material.uniforms.time.value = e.clock.elapsedTime;
      planeRef.current.material.uniforms.width.value = window.innerWidth;
      planeRef.current.material.uniforms.height.value = window.innerHeight;
    }
  });

  const uniforms = useMemo(
    () => ({
      height: { value: 0 },
      width: { value: 0 },
      mouse: { type: "v2v", value: new Vector2(0, 0) },
      planeTexture: { type: "t", value: img },
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

  return (
    <AnimatedPlane
      ref={planeRef}
      rotation={rotation.to((...p) => p)}
      args={initPlaneSize}
      position={position.to((...p) => p)}
    >
      <a.shaderMaterial
        uniforms-mouse={mouse.to((...p) => ({
          type: "v2v",
          value: new Vector2(p[0], p[1]),
        }))}
        uniforms-intensity={intensity.to((p) => ({
          value: p,
          type: "f",
        }))}
        transparent={true}
        attach="material"
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={frag}
      />
      {/* <customMaterial attach="material" color={"white"} map={img} /> */}
    </AnimatedPlane>
  );
});
