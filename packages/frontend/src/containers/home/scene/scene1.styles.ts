import { animated } from "react-spring";
import styled from "styled-components";

export const StyledSceneContainer = styled.div`
  color: black;
  height: 110vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  p {
    font-weight: 700;
  }

  .Scene1-SubCaption {
    color: black;
    display: flex;
    flex-direction: column;
    will-change: transform, opacity;
  }
`;

export const StyledSceneCaption = styled(animated.div) <{
  windowHeight: number;
  opacity?: string;
}>`
  color: black;
  position: absolute;
  top: 0;
  left: 15vw;
  height: ${({ windowHeight }) => windowHeight * 0.9 + "px"};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  opacity: ${({ opacity }) => opacity};
  width: 68%;
  z-index: 99;
  will-change:  opacity;
`;

export const StyledSceneHeading = styled(animated.h2)`
  will-change: transform, opacity;
  font-size: 7vw;
  line-height: 0.8em;
  text-align: left;
  padding-bottom: 2px;
`;
