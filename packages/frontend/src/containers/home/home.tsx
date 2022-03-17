import { Scroll } from "@react-three/drei";
import { useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { Background } from "../../components/background/background";
import Planet from "../../components/background/Planet";
import { Page, PageManager } from "../../components/page/page";
import { StarGroup } from "../../components/star/star";
import { WarpedPlane } from "../../components/warped/warped";
import "./home.css";
import { About } from "./scene/about";
import { Scene1 } from "./scene/scene1";
import { Scene2 } from "./scene/scene2";

const StyledHomeContainer = styled.div`
  display: inline;
`;

function HomeContainer() {
  return (
    <StyledHomeContainer>
      <Background>
        <Scroll>
          <WarpedPlane />
          {/* <Planet /> */}
        </Scroll>
        <Scroll html>
          <PageManager>
            <Page index={0}>
              <Scene1 />
            </Page>
            {/* <Page index={1}>
              <About />
            </Page> */}
          </PageManager>
        </Scroll>
      </Background>
    </StyledHomeContainer>
  );
}

export default HomeContainer;
