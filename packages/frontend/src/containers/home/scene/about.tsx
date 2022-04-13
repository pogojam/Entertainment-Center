//@ts-noCheck

import { Canvas, useFrame, useLoader, useStore } from "@react-three/fiber";
import { a, animated } from "@react-spring/three";
import chance from "chance";
import React, { useMemo, useEffect, useRef, useState } from "react";
import { config, useSpring, useSprings } from "react-spring";
import styled from "styled-components";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import Icon from "../../../icons";
import Projects from "./projects/projects.const";
import frag from "../../../shaders/project.shader.glsl?raw";
import vertex from "../../../shaders/project.vertex.glsl?raw";
import { sRGBEncoding, VideoTexture } from "three";
import { Image, Plane, useAspect, useTexture } from "@react-three/drei";
import { useLocation } from "react-router";

const initPlaneSize = [7, 4, 100, 100, 20];
const AnimatedPlane = animated(Plane);

const VideoTile = ({ videoTexture, i, poster }) => {
  const materialRef = useRef();

  const { position } = useSpring({
    position: [0, 0, 0],
  });
  const setY = (i) => 5 * i;

  useEffect(() => {
    let pos = setY(i);
    window.addEventListener("wheel", (e) => {
      pos += e.deltaY * 0.03;
      position.start([0, pos, 0]);
    });
    position.start([0, pos, 0]);
  }, []);

  useFrame((e) => {
    const mRef = materialRef.current;
    if (mRef) {
      materialRef.current.material.uniforms.time.value = e.clock.elapsedTime;
      materialRef.current.material.uniforms.planeTexture.value.needsUpdate =
        true;
    }
  });

  const uniforms = useMemo(
    () => ({
      planeTexture: { type: "t", value: new VideoTexture(videoTexture) },
      time: { value: 0 },
    }),
    []
  );

  return (
    <mesh key={i}>
      <AnimatedPlane ref={materialRef} position={position} args={initPlaneSize}>
        <shaderMaterial
          // wireframe={true}
          transparent={true}
          attach="material"
          vertexShader={vertex}
          fragmentShader={frag}
          uniforms={uniforms}
        />
      </AnimatedPlane>
    </mesh>
  );
};

export const About = ({ path }) => {
  const scale = useAspect("cover", 1920, 1080, 1);
  const groupRef = useRef();

  const [videos] = useState(() =>
    Projects.map(({ video }) =>
      Object.assign(document.createElement("video"), {
        src: video,
        crossOrigin: "Anonymous",
        loop: true,
        muted: true,
      })
    )
  );

  useEffect(() => {
    videos.forEach((video) => {
      void video.play();
    });
  }, [videos]);

  useFrame(() => {
    if (groupRef.current) {
      // groupRef.current.rotation.y = -0.5;
      // groupRef.current.rotation.y = -0.5;
    }
  });

  return (
    <animated.group rotation={[-0.2, 0, 0]} ref={groupRef}>
      {path === "/Projects" &&
        Projects.map((data, i) => (
          <VideoTile key={i} videoTexture={videos[i]} {...data} i={i} />
        ))}
    </animated.group>
  );
};
