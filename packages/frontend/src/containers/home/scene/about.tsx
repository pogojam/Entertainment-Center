import { useLoader } from "@react-three/fiber";
import chance from "chance";
import React, { useEffect, useState } from "react";
import { animated, config, useSpring, useSprings } from "react-spring";
import styled from "styled-components";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import Icon from "../../../icons";

export const About = () => {
  return (
    <animated.div
      style={{
        position: "relative",
      }}
    >
      {/* <TechIcons show={true} />
      <Line index={1} show={true} /> */}

      <animated.p>
        Big on design and lightning fast code. Found my love for JS developing
        on Node , leveraging the power of Non-Blocking I/O and npm’s rich
        package eco system. Out of necessity I first started learning web
        development in college when I started my first business selling clothing
        online through an e-commerce website. I have since learned more advanced
        techniques building tools for lead generation and business productivity.
      </animated.p>
      {/* <Line index={2} show={true} /> */}
    </animated.div>
  );
};
