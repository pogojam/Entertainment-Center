import { config } from "@react-spring/three";
import { Anchor, Button, Nav } from "grommet";
import * as Icons from "grommet-icons";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { types } from "mobx-state-tree";
import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";
import { useStore } from "../models";
import { BackgroundState } from "./background/background";

export const NavModel = types
  .model({
    top: types.optional(types.number, 0),
    path: types.optional(types.string, ""),
    shouldShow: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setTopPos(newPos: number) {
      self.top = newPos;
    },

    switchPath(path) {
      self.path = path;
    },
    setShouldShow(o) {
      self.shouldShow = o;
    },
  }))
  .views((self) => ({
    get isTop() {
      if (self.path === "/") {
        return false;
      }
      return true;
    },
  }));

const StyledNav = styled(animated.nav)`
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
    color: white;
    /* pointer-events: none; */
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

export const NavMain = observer(() => {
  const { NavStore } = useStore();
  const location = useLocation();

  useEffect(() => {
    NavStore.switchPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Outlet />
    </>
  );
});

export const NavBar = observer(() => {
  const { NavStore, Scene1Store } = useStore();
  const navigate = useNavigate();
  const [showingWidth, setShowingWidth] = useState(
    window.innerWidth < 700 ? "90%" : "50%"
  );

  const { top, opacity, width, borderColor } = useSpring({
    top: 0,
    opacity: NavStore.shouldShow ? 1 : 0,
    borderColor: NavStore.isTop ? "transparent" : "white",
    width: NavStore.shouldShow ? showingWidth : "20%",
    config: config.molasses,
  });

  useLayoutEffect(() => {
    // Shows background on initial load.
    if (NavStore.path !== "/" && BackgroundState.hasLoaded) {
      NavStore.setShouldShow(true);
    }
  }, [NavStore.path, BackgroundState.hasLoaded]);

  useLayoutEffect(() => {
    // RESIZE EVENTS
    const resizeEvent = () => {
      setShowingWidth(window.innerWidth < 700 ? "90%" : "50%");
    };
    window.addEventListener("resize", resizeEvent);
    return () => {
      window.removeEventListener("resize", resizeEvent);
    };
  }, []);

  return (
    <Fragment>
      <StyledNav style={{ opacity, color: borderColor }}>
        <animated.div style={{ width, opacity }} className="wrapper">
          {/* <AboutLettering /> */}
          <Button onClick={() => navigate("/Projects")} label="Projects" />
          <Button onClick={() => navigate("/About")} label="About" />
        </animated.div>
      </StyledNav>
    </Fragment>
  );
});
