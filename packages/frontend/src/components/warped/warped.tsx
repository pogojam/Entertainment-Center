//@ts-noCheck
import { animated, config, useSpring } from "@react-spring/three";
import { Plane, useAspect, useScroll, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Color, MathUtils } from "three";
import "../../materials/customMaterial";
import frag from "../../shaders/frag.shader.glsl?raw";
import vertex from "../../shaders/vertex.shader.glsl?raw";

const AnimatedPlane = animated(Plane);

export const WarpedPlane = () => {
  const scroll = useScroll();
  const planeRef = useRef();
  const img = useTexture(
    "https://res.cloudinary.com/dxjse9tsv/image/upload/v1589865954/01.jpg"
  );
  const { position, rotation } = useSpring({
    rotation: [0, 0, 0],
    position: [0, 0, -120],
    config: config.molasses,
  });
  useFrame((e) => {
    debugger;
    const xVal = scroll.range(0, 1 / 3) * -5;
    const yVal = scroll.range(0, 1 / 3) * 34 - 34;
    const zVal = scroll.range(0, 1 / 3) * -120;

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
      args={[100, 40, 100, 100]}
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
