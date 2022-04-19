//@ts-noCheck

import { useStore } from "../../../models";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
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
import { observer } from "mobx-react";

const initPlaneSize = [4, 3, 100, 100, 20];
const AnimatedPlane = animated(Plane);

const hexToRgbA = (hex) => {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    c = [(c >> 16) & 255, (c >> 8) & 255, c & 255];
    c = c.map((u) => u / 255);
    c.push(1);
    return c;
  }
  throw new Error("Bad Hex");
};

const getCurrentIndex = ({ factor, pos, listLength }) => {
  const len = listLength - 1;
  const index = Math.round(pos / factor);
  if (index > 0) {
    return 0;
  }
  if (index < len * -1) {
    return len * -1;
  }
  return index;
};

const VideoTile = observer(({ videoTexture, i, length, path, color }) => {
  const { AnimStore } = useStore();
  const materialRef = useRef();
  const factor = 3.5;
  const setY = (i) => factor * i;

  let pos = useMemo(() => 0, []);
  let speed = useMemo(() => 0, []);

  console.log("update", pos, speed, i);
  const bottomBound = (length - 1) * factor;

  const { position, rotation, dist, scale } = useSpring({
    position: [0, setY(i), 3],
    rotation: [0, 0, 0],
    dist: 0,
    scale: 1,
  });

  useEffect(() => {
    const event = (e) => {
      // if (pos > setY(i) && e.deltaY > 0) return;
      // if (pos < setY(i) - bottomBound && e.deltaY < 0) return;
      speed += e.deltaY * 0.002;
    };

    window.addEventListener("wheel", event);
    return () => {
      window.removeEventListener("wheel", event);
    };
  }, [path]);

  useFrame((e) => {
    const mRef = materialRef.current;
    if (mRef) {
      materialRef.current.material.uniforms.time.value = e.clock.elapsedTime;
      materialRef.current.material.uniforms.planeTexture.value.needsUpdate =
        true;

      // Scroll Interaction
      speed *= 0.8;
      pos += speed;

      const currentIndex = getCurrentIndex({ factor, pos, listLength: length });
      const currentIndexPosition = currentIndex * factor;

      const diff = currentIndexPosition - pos;
      pos += diff * 0.1;
      const relativePosition = pos + setY(i);

      let distance = Math.min(Math.abs(relativePosition), 1);
      distance = 1 - distance ** 2;

      dist.start(distance, { config: config.molasses });

      position.start([2, relativePosition, 0]);

      if (Math.abs(currentIndex) === i) {
        const newOrbColor = hexToRgbA(color);
      }
    }
  });

  const uniforms = useMemo(
    () => ({
      planeTexture: { type: "t", value: new VideoTexture(videoTexture) },
      time: { value: 0 },
      dist: { value: 0 },
    }),
    []
  );

  return (
    <mesh key={i}>
      <AnimatedPlane
        ref={materialRef}
        rotation={rotation}
        position={position}
        args={initPlaneSize}
        scale={scale}
      >
        <a.shaderMaterial
          // wireframe={true}
          uniforms-dist={dist.to((p) => ({
            value: p,
          }))}
          transparent={true}
          attach="material"
          vertexShader={vertex}
          fragmentShader={frag}
          uniforms={uniforms}
        />
      </AnimatedPlane>
    </mesh>
  );
});

export const About = observer(({ path }) => {
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
    <animated.group
      visible={path === "/Projects"}
      rotation={[-0.3, -0.4, -0.2]}
      ref={groupRef}
    >
      {Projects.map((data, i) => (
        <VideoTile
          path={path}
          length={Projects.length}
          key={i}
          videoTexture={videos[i]}
          {...data}
          i={i}
        />
      ))}
    </animated.group>
  );
});
