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
  const planeRef = useRef();
  const [hasMounted, setHasMounted] = useState(false);
  const [unlockMouse, setUnlockMouse] = useState(false);
  const img = useTexture(
    "https://res.cloudinary.com/dxjse9tsv/image/upload/v1589865954/01.jpg"
  );

  const initPlaneSize = [20, 20, 100, 100];
  const initPlanePosition = [0, 0, -3];
  const initPlaneRotation = [0, 0, 0];

  const { position, rotation, mouse, intensity } = useSpring({
    rotation: initPlaneRotation,
    position: initPlanePosition,
    intensity: 0.0,
    mouse: [0, 1],
    config: config.molasses,
  });

  useLayoutEffect(() => {
    setHasMounted(true);
  }, []);

  useFrame((e) => {
    if (unlockMouse) {
      mouse.start([e.mouse.x, e.mouse.y]);
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

  // Has Mounted Effect.
  useEffect(async () => {
    mouse.start([0, 0], {
      config: {
        mass: 3,
        friction: 3,
        velocity: 0,
        tension: 2,
      },
      onStart(elapsedTime) {
        setTimeout(() => {
          setUnlockMouse(true);
        }, 1900);
      },
    });

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
  }, [hasMounted]);

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
    <mesh scale={[3, 3, 3]}>
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
          transparent={false}
          attach="material"
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={frag}
          depthTest={false}
        />
        {/* <customMaterial attach="material" color={"white"} map={img} /> */}
      </AnimatedPlane>
    </mesh>
  );
});
