import { useEffect } from "react";
import { animated, useSpring, config } from "react-spring";
import { StyledSceneCaption, StyledSceneHeading } from "./scene1.styles";
import { useFrame } from "@react-three/fiber";

export const Scene1 = () => {
  const { opacity, header } = useSpring({
    opacity: 0,
    header: [0.3, 0.3, 1],
  });

  useFrame((e) => {
    header.start([e.mouse.x * -0.5, e.mouse.y], {
      config: config.stiff,
    });
  });
  useEffect(() => {
    opacity.start(1);
  }, []);

  return (
    <StyledSceneCaption>
      <StyledSceneHeading style={{ opacity }}>
        <animated.h1
          style={{
            textShadow: header.to(
              (x, y) => `${x * 13}px ${y * 13}px ${2}px #a8a3ed`
            ),
            transform: header.to((v, p, s) => `scale(${s})`),
          }}
          className="Name-2"
        >
          Ryan
        </animated.h1>
        <animated.h1
          style={{
            textShadow: header.to(
              (x, y) => `${x * 13}px ${y * 13}px ${2}px #a8a3ed`
            ),
            transform: header.to((v, p, s) => `scale(${s})`),
          }}
          className="Name-1"
        >
          Breaux
        </animated.h1>
      </StyledSceneHeading>
      <animated.div
        className={"Scene1-SubCaption"}
        style={{
          display: "flex",
        }}
      >
        <p>Building digital products in Phoenix AZ.</p>
      </animated.div>
    </StyledSceneCaption>
  );
};
