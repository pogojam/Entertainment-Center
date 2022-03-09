import { Anchor, Button, Nav } from "grommet";
import * as Icons from "grommet-icons";
import { Fragment } from "react";
import { Outlet, useNavigate } from "react-router";

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* <Nav align="center" direction="row" background="brand" pad="medium">
        <Anchor onClick={() => navigate("/")} icon={<Icons.Home />} />
        <Button
          onClick={() => navigate("/Login")}
          margin={{ left: "auto" }}
          label="Login"
        />
      </Nav> */}
      <Outlet />
    </Fragment>
  );
};
