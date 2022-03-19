import { Anchor, Button, Nav } from "grommet";
import * as Icons from "grommet-icons";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { Fragment, useEffect, useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";

class State {
  top = 0;
  constructor() {
    makeAutoObservable(this);
  }

  setTopPos(newPos: number) {
    this.top = newPos;
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
    padding: 20px;
    margin: 20px;
  }

  button {
    border: none;
    font-family: "break/regular";
  }

  button:hover {
    border: none;
    box-shadow: none;
  }
`;

export const NavBar = observer(() => {
  const navigate = useNavigate();

  const { top } = useSpring({
    top: 0,
  });

  useLayoutEffect(() => {
    const height = NavState.top;
    top.set(height);
  }, [NavState.top]);

  return (
    <Fragment>
      <StyledNav style={{ top }}>
        <div className="wrapper">
          <Button onClick={() => navigate("/Login")} label="Projects" />
          <Button onClick={() => navigate("/Login")} label="About" />
        </div>
      </StyledNav>
      <Outlet />
    </Fragment>
  );
});
