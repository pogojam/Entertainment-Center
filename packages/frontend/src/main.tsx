import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import HomeContainer from "./containers/home/home";
import { NavBar } from "./components/nav";
import { Grommet } from "grommet";
import theme from "./theme";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./containers/login/login";
import { MoviesContainer } from "./containers/movies/movies";
import { Page } from "./components/page/page";
import { Scene1 } from "./containers/home/scene/scene1";
import { About } from "./containers/home/scene/about";
import { config, useTransition } from "react-spring";

const AppRoutes = () => {
  return (
    <Grommet style={{ height: "100%" }} theme={theme}>
      <Routes>
        <Route path="/*" element={<NavBar />}>
          <Route path="*" element={<HomeContainer />} />
          {/* <Route path="/Login" element={<Login />} />
              <Route path="/Movies" element={<MoviesContainer />} /> */}
        </Route>
      </Routes>
    </Grommet>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
