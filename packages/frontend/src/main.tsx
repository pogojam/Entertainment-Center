import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import HomeContainer from "./containers/home/home";
import { NavBar } from "./components/nav";
import { Grommet } from "grommet";
import theme from "./theme";
import { Background } from "./components/background";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./containers/login/login";

ReactDOM.render(
  <React.StrictMode>
    <Grommet style={{ height: "100%" }} theme={theme}>
      <Background background="light-2">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NavBar />}>
              <Route path="/" element={<HomeContainer />} />
              <Route path="/Login" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Background>
    </Grommet>
  </React.StrictMode>,
  document.getElementById("root")
);
