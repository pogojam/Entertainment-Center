import React, { useEffect, useState, useLayoutEffect } from "react";
import Container from "../container";
import { MdClose } from "react-icons/md";
import { Text, Box, Heading, Image } from "rebass";
import { useSpring, useTransition, config, animated, a } from "react-spring";
import { Icon, Button } from "../elements/";
import ProjectData from "../../static/projects";
import { FiGlobe, FiBookmark, FiLock } from "react-icons/fi";
import styled, { keyframes, css } from "styled-components";

const animation_slowFadeIn = keyframes`
from{
    opacity:1;
}
to{
  opacity:.6;
}
`;

const DiscriptionContainer = styled(animated.div)`
  height: 100%;
  width: 50%;

  @media (max-width: 900px) {
    height: 50%;
    width: 100%;
    padding-top: 0px;
  }
`;

const ViewHeading = styled(Heading)`
  transform: ${({ isActive }) =>
    isActive ? "translateY(0%)" : "translateY(-90vh)"};
  color: black;
  border-bottom-right-radius: "12px";

  @media (max-width: 900px) {
    color: white;
    transform: ${({ isActive }) =>
      isActive ? "translateY(15vh)" : "translateY(-90vh)"};
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`;

const CircleButton = styled(Button)`
  position: relative;
  width: 3em;
  height: 3em;
  margin: 1em;
  color: "white";
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 3s;
  border-radius: 50%;
  background: black;

  &:after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    border: 1px solid white;

    box-shadow: 0 0 18pt 2pt blue, 0 0 0pt 2pt blue inset;
    transition: transform 4s;
  }

  &:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    box-shadow: 0 0 18pt 2pt red, 0 0 0pt 2pt red inset;
    transition: transform 4s;
  }

  &:hover {
    &:before {
      transform: scale(1.1);
    }
    &:after {
      transform: scale(1.3);
    }
  }
`;

const BackButton_Styles = styled(Button)`
  --icon-color: white;
  --icon-pos-top: 25%;

  position: absolute;
  z-index: 9999;
  width: 55px;
  height: 55px;
  bottom: 0;
  left: 50%;
  transform: translateY(0%) translateX(-50%);
  transition: transform opacity 1s 5s;
  opacity: ${({ isActive }) => (isActive ? 1 : 0)};
  font-family: "Monoton", cursive !important;
  max-width: 100px;
  align-items: center;
  background: rgb(64, 64, 64);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    left: 0;
    transform: translateY(0%) translateX(0%);
    border-top-left-radius: 0;
  }
`;

const BackButton = (props) => (
  <BackButton_Styles {...props}>
    <MdClose color="white" />
  </BackButton_Styles>
);

const SlantView = styled(Container)`
  will-change: transform;
  transition: transform 1.2s 0.5s cubic-bezier(0.215, 0.61, 0.355, 1),
    opacity 0.4s;
  z-index: 1;

  ${({ isActive, side }) =>
    isActive
      ? css`
          transform: translateX(${side === "left" ? "0%" : "0%"});

          opacity: 1;
        `
      : css`
          transform: translateX(${side === "left" ? "-150%" : "150%"});
          opacity: 0;
        `}
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: ${animation_slowFadeIn} 4s forwards;
  }
`;

const Content = ({
  data: { discription, poster, title, gitLink, link, type },
  stackObj,
  props,
  isActive,
  inAnimation,
  setView,
}) => {
  const [isSubmit, setSubmit] = useState(false);
  const [showModle, toggleModle] = useState(false);
  const [message, setMessage] = useState();

  const desktopAnim = [`translateX(0%)  `, `translateX(40%) `];

  const slideCalcY = (val, pol) => `translateY(${val * pol}%)`;
  const playVideo = (p, ref) => {
    if (p === poster && ref) {
      ref.setAttribute("playsinline", true);
      ref.play();
    }
  };

  const containerIndex = (status) => {
    return status ? 1 : 0;
  };

  const DiscriptionText = styled(Text)``;

  const PermissionForm = styled.form`
    color: white;
    display: flex;
    flex-direction: column;
    left: 1em;
    border-radius: 3px;
    overflow: hidden;

    input {
      background: transparent;
      color: white;
      border: 1px solid #ffffff5e;
      margin: 0.2em;
      font-size: 0.8em;
    }
    &:after {
      content: "Thank You";
      width: 100%;
      height: 100%;
      background: #00f951e8;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: black;
      transition: transform 1s linear;
      transform: ${({ isSubmit }) =>
        isSubmit ? "translateY(0%)" : "translateY(100%)"};
    }
  `;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmit(true);
  };

  return (
    <>
      {showModle && (
        <PermissionForm
          netlify-honeypot="bot-field"
          data-netlify="true"
          method="POST"
          p="1em"
          name="Project_Permission"
          onSubmit={handleFormSubmit}
          isSubmit={isSubmit}
        >
          <Text
            m="0.2em"
            p="0.2em"
            lineHeight=".9em"
            fontSize=".8em"
            color="#ffffff5e"
            textAlign={["center", "initial"]}
            style={{ borderBottom: "1px solid #ffffff5e" }}
          >
            This project requires login credentials; please submit a request for
            access.
          </Text>
          <input placeholder="Reason" name="message" type="text" />
          <input placeholder="email" name="email" type="email" />
          <input placeholder="email" type="submit" />
        </PermissionForm>
      )}
      <Container
        animate
        flexDirection={["column", "row"]}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: "100%",
          willChange: "transform ",
          display: "flex",
          // zIndex: containerIndex(isActive),
          zIndex: 0,
          // transform: inAnimation.slide.interpolate(e => slideCalcY(e, -1)),
        }}
        type="Flex"
        flexBasis="100%"
      >
        <SlantView
          side="left"
          isActive={isActive}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            background: "beige",
            position: "relative",
          }}
        >
          {ProjectData.map((d, i) => (
            <Container
              key={d.title}
              as="video"
              animate
              className="prjImg"
              ref={(ref) => playVideo(d.poster, ref)}
              left={["0%", "-50%"]}
              style={{
                position: "absolute",
                background: `url(${poster})`,
                backgroundSize: "cover",
                top: "0",
                height: "100%",
                opacity: d.title === title ? 1 : 0,
              }}
            >
              <source src={d.video} type="video/mp4" />
            </Container>
          ))}
        </SlantView>

        <SlantView
          isActive={isActive}
          style={{
            width: "100%",
            height: "100%",
            background: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></SlantView>
      </Container>
      <BackButton
        isActive={isActive}
        onClick={() => {
          setSubmit(false);
          setView({ type: "SET_VIEW", input: {} });
        }}
      />
      <ViewHeading
        width={["inherit"]}
        fontSize={["3em"]}
        fontWeight="900"
        textAlign={["left", "center"]}
        isActive={isActive}
        style={{
          whiteSpace: "nowrap",
          boxShadow: "0px 5px 8px 3px #00000073",
          fontFamily: "inherit",
          letterSpacing: "5px",
          display: "flex",
          transition: "opacity 1s .3s , transform 1s ",
          opacity: isActive ? 1 : 0,
          background: "rgba(126, 124, 127, 0.67)",
          position: "absolute",
          left: 0,
          top: 0,
          willChange: "transform opacity",
          backdropFilter: "blur(5px)",
          color: "white",
        }}
        fontWeight="900"
        px="1em"
        py=".1em"
      >
        {title}
      </ViewHeading>

      <DiscriptionContainer
        style={{
          willChange: "transform opacity",
          position: "absolute",
          zIndex: 1,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          opacity: props.opacity.interpolate((e) => e),
          transform: inAnimation.slide.interpolate((e) => slideCalcY(e, 1)),
        }}
      >
        <Container
          type="Flex"
          p={["0em", "1em"]}
          alignItems="center"
          flexDirection="column"
          justifyContent="flex-end"
          alignItems="center"
          style={{
            position: "relative",
            flexBasis: "100%",
            justifyContent: "center",
            zIndex: 0,
            position: "absoulte",
            top: "50%",
          }}
        >
          <DiscriptionText
            maxWidth={["", "30%"]}
            m={["1em", ""]}
            style={{
              position: "relative",
              letterSpacing: -1,
              transition: "opacity 1s .4s",
              opacity: isActive ? 1 : 0,
              borderRadius: "4px",
              maxWidth: "350px",
              fontSize: ".9em",
            }}
            p="1em"
            bg="rgb(64,64,64)"
            fontFamily={"sans-serif"}
            color="#dcc2c2"
          >
            {message && (
              <Box
                style={{
                  position: "absolute",
                  top: "-25px",
                  right: 0,
                  height: "25px",
                  background: "rgb(45, 45, 45)",
                  borderTopRightRadius: "3px",
                  borderTopLeftRadius: "3px",
                  color: "#ffffff7a",
                  zIndex: "-1",
                }}
                px="10px"
                className="animated fadeInUp"
              >
                {message}
              </Box>
            )}
            <h2
              style={{
                paddingBottom: "1em",
                color: "white",
                borderBottom: "1px solid #ffffff7a",
              }}
            >
              Purpose
            </h2>

            <Box
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* <Icon
                style={{
                  transition: "opacity 1s .1s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "red",
                  opacity: isActive ? 1 : 0,
                }}
                className="hoverGrow"
                github={gitLink}
                color="red"
              /> */}
              {type === "auth" && (
                <FiLock
                  style={{
                    color: "red",
                    marginRight: "10px",
                    marginLeft: "10px",
                  }}
                  onMouseEnter={() =>
                    setMessage("This app is private, request to view")
                  }
                  onMouseLeave={() => setMessage(null)}
                />
              )}
              <FiBookmark
                style={{
                  color: "red",
                }}
              />
            </Box>

            {discription}

            {/* <Icon
              color="beige"
              my="20px"
              style={{
                transition: "opacity 1s ",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: isActive ? 1 : 0,
              }}
              {...stackObj}
            /> */}
          </DiscriptionText>

          <a href={link}>
            <CircleButton
              style={{
                transition: "opacity 1s .2s",
                opacity: isActive ? 1 : 0,
              }}
              text={type === "auth" ? FiLock() : FiGlobe()}
              onMouseEnter={() =>
                type === "auth" &&
                setMessage("This app is private, request to view")
              }
              onMouseLeave={() => type === "auth" && setMessage(null)}
            />
          </a>
        </Container>
      </DiscriptionContainer>
    </>
  );
};

const ViewerComponent = ({ inAnimation, data, isActive, setView }) => {
  const transitions = useTransition(data, null, {
    from: { opacity: 0, slideY: [60], slideX: [30] },
    enter: { opacity: 1, slideY: [0], slideX: [0] },
    leave: { opacity: 0, slideY: [-60], slideX: [-30] },
    config: { mass: 1, tension: 210, friction: 20 },
  });
  return (
    <>
      {transitions.map(({ key, props }) => {
        const { stack = [] } = data;

        const stackObj = stack.reduce((acc, val) => {
          Object.assign(acc, { [val]: val });
          return acc;
        }, {});

        return (
          <Content
            key={key}
            setView={setView}
            inAnimation={inAnimation}
            key={key}
            stackObj={stackObj}
            props={props}
            data={data}
            isActive={isActive}
          />
        );
      })}
    </>
  );
};

export const Viewer = ({ store, dispatch }) => {
  const [enterView, setEnter] = useState();
  const { view = {} } = store;
  const [pRef, setRef] = useState();

  useEffect(() => {
    if (Object.entries(view).length > 0) {
      setEnter(true);
    } else {
      setEnter(false);
    }

    if (view.ref) {
      setRef(pRef);
    }
  }, [view]);

  useEffect(() => {
    if (enterView) {
      set({ slide: [0], opacity: [1] });
      // document.body.style.overflow = "hidden"
      stop();
    } else {
      // document.body.style.overflow = "scroll"
      const icon = view.ref;
      if (icon) {
        if (icon.current) {
          icon.current.style.transition = "opacity .7s";
          icon.current.style.opacity = 0;
        }
      }
      set({
        slide: [100],
        opacity: [0],
      });
    }

    return () => {
      document.body.style.overflow = "scroll";
    };
  }, [enterView]);

  const [animation, set, stop] = useSpring(() => ({
    pRef: [2],
    slide: [100],
    opacity: [0],
  }));

  return (
    <ViewerComponent
      setView={dispatch}
      isActive={enterView}
      inAnimation={animation}
      data={view}
    />
  );
};
