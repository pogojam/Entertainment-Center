import { config } from "@react-spring/three";
import { Anchor, Button, Nav } from "grommet";
import * as Icons from "grommet-icons";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";

class State {
  top = window.innerHeight * 0.5;
  opacityAnim;
  shouldShow = false;
  path = null;

  constructor() {
    makeAutoObservable(this);
  }

  setTopPos(newPos: number) {
    this.top = newPos;
  }
  switchPath(path) {
    this.path = path;
  }

  setShouldShow(o) {
    this.shouldShow = o;
  }
}

export const NavState = new State();

const StyledNav = styled(animated.nav)`
  position: absolute;
  width: 100%;
  z-index: 99;
  display: flex;
  justify-content: center;

  .wrapper {
    width: 40%;
    display: flex;
    justify-content: center;
    border-top: 1px solid;
    /* border-bottom: 1px solid; */
    padding: 10px;

    @media screen and (max-width: 700px) {
      width: 90%;
    }
  }

  button {
    border: none;
    font-family: "Roboto";
    text-transform: uppercase;
    font-weight: bold;
    transition: transform 0.3s;
    color: black;
  }

  button:hover {
    border: none;
    box-shadow: none;
    transform: scale(1.1);
  }

  // About Lettering

  h2 {
    font-size: 2rem;
    text-shadow: 0px 4px 9px black;
  }
`;

const AboutLettering = () => {
  return (
    <div>
      <h2>Mindful Developer</h2>
    </div>
  );
};

export const NavBar = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showingWidth, setShowingWidth] = useState(
    window.innerWidth < 700 ? "90%" : "50%"
  );

  const { top, opacity, width } = useSpring({
    top: NavState.top,
    opacity: NavState.shouldShow ? 1 : 0,
    width: NavState.shouldShow ? showingWidth : "20%",
    config: config.molasses,
  });

  useLayoutEffect(() => {
    const resizeEvent = () => {
      setShowingWidth(window.innerWidth < 700 ? "90%" : "50%");
    };
    window.addEventListener("resize", resizeEvent);
    return () => {
      window.removeEventListener("resize", resizeEvent);
    };
  }, []);

  useLayoutEffect(() => {
    const height = NavState.top;
    top.set(height);
  }, [NavState.top]);

  return (
    <Fragment>
      <StyledNav style={{ top, opacity }}>
        <animated.div style={{ width, opacity }} className="wrapper">
          <AboutLettering />
          {/* <Button
            onClick={() => NavState.switchPath("Projects")}
            label="Projects"
          />
          <Button onClick={() => navigate("/")} label="About" /> */}
        </animated.div>
      </StyledNav>
      <Outlet />
    </Fragment>
  );
});
