import { config } from "@react-spring/three";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
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
import {
  AiFillMediumSquare,
  AiFillLinkedin,
  AiFillTwitterSquare,
  AiOutlineGithub,
} from "react-icons/ai";

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
  /* 
  &::after {
    content: "";

    border-radius: 50%;
    border: 1px solid white;
    width: 100%;
  } */

  .wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-top: 1px solid;
    /* border-bottom: 1px solid; */
    padding-top: 10px;
    padding-bottom: 10px;
    gap: 17px;

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

  .AboutLettering {
    display: flex;
    align-items: center;
    padding-right: 1pc;

    h2 {
      font-size: 1rem;
      text-shadow: 0px 4px 9px black;
      letter-spacing: 1px;
      white-space: nowrap;
    }
  }
`;

const AboutLettering = () => {
  return (
    <div className="AboutLettering">
      <h2>human,software engineer,entrepreneur</h2>
    </div>
  );
};

const StyledLinkBar = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 1.5em;
  display: flex;
  z-index: 999;
  color: white;
  svg {
    width: 30px;
    height: 30px;
  }
`;

export const NavMain = observer(() => {
  const { NavStore } = useStore();
  const location = useLocation();

  useEffect(() => {
    NavStore.switchPath(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <StyledLinkBar>
        <a href="https://www.linkedin.com/in/ryan-breaux-4603396a/">
          <AiFillLinkedin />
        </a>
        <a href="https://medium.com/@aisfbcxk">
          <AiFillMediumSquare />
        </a>
        <a href="https://github.com/pogojam">
          <AiOutlineGithub />
        </a>
        {/* <a href="https://www.linkedin.com/in/ryan-breaux-4603396a/">
          <AiFillTwitterSquare />
        </a> */}
      </StyledLinkBar>
      <Outlet />
    </>
  );
});

export const NavBar = observer(() => {
  const { NavStore, Scene1Store } = useStore();
  const navigate = useNavigate();
  const [showingWidth, setShowingWidth] = useState("100%");

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
      setShowingWidth("100%");
    };
    window.addEventListener("resize", resizeEvent);
    return () => {
      window.removeEventListener("resize", resizeEvent);
    };
  }, []);

  return (
    <Fragment>
      <StyledNav
        onClick={() => navigate("/Projects")}
        style={{ opacity, color: borderColor }}
      >
        <animated.div style={{ width, opacity }} className="wrapper">
          <AboutLettering />
          <button>
            <BsFillArrowDownCircleFill onClick={() => navigate("/Projects")} />
          </button>
          {/* <Button onClick={() => navigate("/Projects")} label="Projects" /> */}
          {/* <Button onClick={() => navigate("/About")} label="About" /> */}
        </animated.div>
      </StyledNav>
    </Fragment>
  );
});
