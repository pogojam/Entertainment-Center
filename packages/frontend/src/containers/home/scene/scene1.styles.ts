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
    align-items: center;
  color: black;
  top: 0;
  left: 15vw;
  justify-content: center;
  opacity: ${({ opacity }) => opacity};
  z-index: 99;
  will-change:  opacity;
  height: 100%;
    display: flex;
    flex-direction: column;
    padding: 1em;

    p{
      font-size: 24px;
    font-weight: bolder;
    color: black;
    text-shadow: rgb(172 128 128) -1.08454px -0.67567px 14px;
    }

`;

export const StyledSceneHeading = styled(animated.div)`
  line-height: 0.8em;
    display: flex;
    gap: 0.4em;
    justify-content: center;
    opacity: 0;

    min-height: 45px;
    align-items: center;

  h1{
    white-space: nowrap;
    text-transform: uppercase;
    text-shadow: 0px 4px 9px black;
    margin-right: -40px;
    /* text-shadow: 1px 7px 13px #a8a3ed; */
  }
    .Name-1{
    /* text-shadow: 1px 7px 13px #e80000; */
    }

  @media screen and (min-width: 700px){
      font-size: 30px;
      letter-spacing: 30px;
      font-weight: 900;
  }

  @media screen and (max-width: 700px){
      font-size: 18px;
      letter-spacing: 10px;
      font-weight: 900;
  }
`;
