//@ts-noCheck

import { useStore } from "../../../models";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { animated } from "@react-spring/three";
import { animated as a } from "react-spring";
import chance from "chance";
import React, {
  useMemo,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { config, useSpring, useSprings } from "react-spring";
import styled from "styled-components";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import Icon from "../../../icons";
import Projects from "./projects/projects.const";
import frag from "../../../shaders/project.shader.glsl?raw";
import vertex from "../../../shaders/project.vertex.glsl?raw";
import { sRGBEncoding, Vector3, VideoTexture } from "three";
import { Html, Image, Plane, useAspect, useTexture } from "@react-three/drei";
import { useLocation } from "react-router";
import { observer } from "mobx-react";

const initPlaneSize = [4, 3, 100, 100, 20];
const AnimatedPlane = animated(Plane);

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

const StyledTileDescription = styled(Html)`
  font-family: "Roboto", sans-serif;
  position: relative;
  width: 75vw;
  height: 100vh;
  display: flex;
  align-items: center;

  @media (max-width: 750px) {
    width: 100vw;
  }

  .Tile_Link_List {
    display: flex;
    gap: 15px;

    a {
      border: 1px solid;
      padding: 4px;
      border-radius: 5px;
      font-weight: bold;
    }
  }

  .Project_Container {
    /* backdrop-filter: blur(22px); */
    /* background-color: #17141442; */
    padding: 1.2em;
    border-radius: 23px;
    color: black;
    display: grid;
    grid-gap: 17px;
  }
  img {
    width: 75px;
    height: 75px;
    position: absolute;
    bottom: 32px;
  }
  h1 {
    font-weight: bold;
    font-size: 6em;
    line-height: normal;
    margin: 0;
  }
  .Description {
    width: 70%;
    font-weight: bold;
    font-size: 1.2em;
    line-height: 35px;

    @media (max-width: 750px) {
      width: 100%;
    }
  }

  /* .Project_Three_Container {
    left: 0px;
  } */
`;

const TileDescription = ({
  contrast,
  link,
  gitLink,
  logo,
  title,
  dist,
  description,
}) => {
  // const [translation, setTranslation] = useState(0);
  // const ref = useRef();

  // useLayoutEffect(() => {
  //   setTranslation((window.innerWidth - window.innerWidth / 5) * -1);
  //   if (ref.current) {
  //     const { left } = ref.current.getBoundingClientRect();
  //   }
  // }, []);

  const v1 = new Vector3();
  const v2 = new Vector3();
  const v3 = new Vector3();

  function defaultCalculatePosition(
    el: Object3D,
    camera: Camera,
    size: { width: number; height: number }
  ) {
    const objectPos = v1.setFromMatrixPosition(el.matrixWorld);
    objectPos.project(camera);
    const widthHalf = size.width / 2;
    const heightHalf = size.height / 2;
    const yPos = -(objectPos.y * heightHalf) + heightHalf;
    return [0, yPos - window.innerHeight / 2];
  }

  const calcPos = (el, cam, size) => {
    return [0, window.innerHeight / 3, 0];
  };

  return (
    <StyledTileDescription calculatePosition={defaultCalculatePosition}>
      <a.div
        className={"Project_Container"}
        style={{
          opacity: dist,
          color: contrast,
        }}
      >
        <a.h1>{title}</a.h1>
        <div className="Tile_Link_List">
          {gitLink.length > 0 && <a href={gitLink}>Github</a>}
          {link && <a href={link}>website</a>}
        </div>
        <a.div className={"Description"}>{description}</a.div>
        <img src={logo} />
      </a.div>
    </StyledTileDescription>
  );
};

const VideoTile = observer(
  ({
    isVisible,
    videoTexture,
    logo,
    description,
    i,
    length,
    path,
    link,
    gitLink,
    color,
    contrast,
    title,
  }) => {
    const { AnimStore } = useStore();
    const materialRef = useRef();
    const factor = 3.5;
    const setY = (i) => factor * i;

    let pos = useMemo(() => 0, []);
    let speed = useMemo(() => 0, []);

    const bottomBound = (length - 1) * factor;

    const { position, rotation, dist, scale } = useSpring({
      position: [0, setY(i), 3],
      rotation: [0, -0.9, 0],
      dist: 0,
      scale: 1,
    });

    useEffect(() => {
      const event = (e) => {
        speed += e.deltaY * 0.002;
      };

      window.addEventListener("wheel", event);
      window.addEventListener("touchmove", event);
      return () => {
        window.addEventListener("touchmove", event);
        window.removeEventListener("wheel", event);
      };
    }, [path]);

    // useEffect(() => {
    //   if (AnimStore.activeIndex === i) {
    //     rotation.start([0, 0, 0]);
    //   }
    // }, [AnimStore.activeIndex]);

    useFrame((e) => {
      const mRef = materialRef.current;
      if (mRef) {
        materialRef.current.material.uniforms.time.value = e.clock.elapsedTime;
        materialRef.current.material.uniforms.planeTexture.value.needsUpdate =
          true;

        // Scroll Interaction
        speed *= 0.8;
        pos += speed;

        const currentIndex = getCurrentIndex({
          factor,
          pos,
          listLength: length,
        });
        const currentIndexPosition = currentIndex * factor;

        const diff = currentIndexPosition - pos;
        pos += diff * 0.1;
        const relativePosition = pos + setY(i);

        let distance = Math.min(Math.abs(relativePosition), 1);
        distance = 1 - distance ** 2;

        dist.start(distance, { config: { duration: 250 } });

        position.start([0, relativePosition, 0]);

        if (Math.abs(currentIndex) === i && AnimStore.activeIndex !== i) {
          // rotation.start([0, -0.5, 0]);
          AnimStore.setActiveIndex(i);
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
      <>
        <mesh key={i}>
          <AnimatedPlane
            ref={materialRef}
            rotation={rotation}
            position={position}
            args={initPlaneSize}
            scale={scale}
          >
            <TileDescription
              gitLink={gitLink}
              link={link}
              logo={logo}
              description={description}
              dist={dist}
              title={title}
              contrast={contrast}
            />
            <animated.shaderMaterial
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
      </>
    );
  }
);

export const About = observer(({ path }) => {
  const scale = useAspect(1920, 1080, 1);
  const groupRef = useRef();
  const isVisible = path === "/Projects";

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

  const { position, rotation } = useSpring({
    position: [0, 0, 0, 0],
    rotation: [0, 0, -0.2],
    config: config.molasses,
  });

  useEffect(() => {
    videos.forEach((video) => {
      void video.play();
    });
  }, [videos]);

  useEffect(() => {
    if (isVisible) {
      const pos = scale[0] / 5;
      rotation.start([0, 0, -0.2]);
      position.start([pos, 0, 0, 0]);
    } else {
      // rotation.start([-2.0, -1.0, -0.2]);
      position.start([0.0, 40.0, 0]);
      // position.start([0, 0, 0]);
    }
  }, [isVisible, scale]);

  useFrame(() => {
    if (groupRef.current) {
      // groupRef.current.rotation.y = -0.5;
      // groupRef.current.rotation.y = -0.5;
    }
  });

  return (
    <animated.group
      // visible={isVisible}
      // rotation={[-0.3, -0.4, -0.2]}
      position={position}
      rotation={rotation}
      ref={groupRef}
    >
      {Projects.map((data, i) => (
        <VideoTile
          isVisible={isVisible}
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
