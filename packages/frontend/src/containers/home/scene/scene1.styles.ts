import { animated } from "react-spring";
import styled from "styled-components";

export const StyledSceneContainer = styled.div`
  color: black;

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

interface ISceneCaption {
  opacity?: string;
}
export const StyledSceneCaption = styled(animated.div) <ISceneCaption>`
  color: black;
  top: 0;
  left: 15vw;
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
