import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import HomeContainer from "./containers/home/home";
import { NavBar } from "./components/nav";
import { Grommet } from "grommet";
import theme from "./theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./containers/login/login";
import { MoviesContainer } from "./containers/movies/movies";

ReactDOM.render(
  <React.StrictMode>
    <Grommet style={{ height: "100%" }} theme={theme}>
      <Suspense fallback={null}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<NavBar />}>
              <Route path="/" element={<HomeContainer />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Movies" element={<MoviesContainer />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </Grommet>
  </React.StrictMode>,
  document.getElementById("root")
);
