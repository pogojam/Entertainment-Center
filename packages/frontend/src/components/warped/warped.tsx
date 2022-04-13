//@ts-noCheck
import { a, animated, config, useSpring } from "@react-spring/three";
import { Plane, useAspect, useScroll, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { observer } from "mobx-react";
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
import { useStore } from "../../models";
import frag from "../../shaders/frag.shader.glsl?raw";
import vertex from "../../shaders/vertex.shader.glsl?raw";

const AnimatedPlane = animated(Plane);
const STATES = {
  default: {
    mouse: [0, 1],
    intensity: 0.0,
  },
  entered: {
    mouse: [0, 0],
    intensity: 3.3,
  },
};

const entranceSequence = async ({
  intensity,
  mouse,
  mSize,
  setUnlockMouse,
}) => {
  // mSize.set(0.4);
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
};

const useAnimState = ({ intensity, mSize, mouse, planeRef }) => {
  const { NavStore, AnimStore } = useStore();
  const [unlockMouse, setUnlockMouse] = useState(false);

  useEffect(() => {
    if (NavStore.path === "/Projects") {
      entranceSequence({ intensity, mouse, setUnlockMouse, mSize });
      setUnlockMouse(false);
      // mouse.set([0, 0]);
      // intensity.set(3.3);
      // mSize.set(3.2);
      AnimStore.setMSize(3.2);
      AnimStore.setMouse([0, 0]);
      AnimStore.setIntensity(3.3);
    }
    if (NavStore.path === "/") {
      entranceSequence({ intensity, mouse, setUnlockMouse, mSize });
      AnimStore.setMSize(0.4);
      mouse.set([0, 0]);
      setUnlockMouse(true);
    }
  }, [NavStore.path]);

  // Has Mounted Effect.
  useEffect(() => {
    if (AnimStore.entranceAnim) {
      entranceSequence({ intensity, mouse, setUnlockMouse, mSize });
    }
  }, [AnimStore.entranceAnim]);

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
};

export const WarpedPlane = observer(() => {
  const planeRef = useRef();
  const { AnimStore } = useStore();

  const initPlaneSize = [20, 20, 100, 100];
  const initPlanePosition = [0, 0, -3];
  const initPlaneRotation = [0, 0, 0];

  const { position, rotation, mouse, intensity, mSize } = useSpring({
    mSize: AnimStore.mSize,
    rotation: initPlaneRotation,
    position: initPlanePosition,
    intensity: AnimStore.intensity,
    mouse: AnimStore.mouse,
    config: config.molasses,
  });

  useAnimState({ mouse, mSize, intensity, planeRef });

  const uniforms = useMemo(
    () => ({
      height: { value: 0 },
      width: { value: 0 },
      mouse: { type: "v2v", value: new Vector2(0, 0) },
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
          uniforms-mSize={mSize.to((p) => ({
            value: p,
          }))}
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
