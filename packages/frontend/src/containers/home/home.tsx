import { useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { Background } from "../../components/background/background";
import CanvasBackground from "../../components/background/background.canvas";
import "./home.css";
import { About } from "./scene/about";
import { Scene1 } from "./scene/scene1";
import { Scene2 } from "./scene/scene2";

const StyledHomeContainer = styled.div`
  display: inline;
`;

function HomeContainer() {
  useLayoutEffect(() => {
    new CanvasBackground("HomeContainer");
  }, []);
  return (
    <StyledHomeContainer>
      <Background>
        <Scene1 />
        <About />
        {/* <Scene2 /> */}
      </Background>
    </StyledHomeContainer>
  );
}

export default HomeContainer;
