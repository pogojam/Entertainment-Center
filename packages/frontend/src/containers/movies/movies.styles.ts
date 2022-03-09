import styled from "styled-components";

export const StyledMovieInformationPane = styled.div`
  flex-basis: 75%;
  background-color: aqua;
`;
export const StyledMovieSelectionPane = styled.div`
  flex-basis: 45%;
  background-color: darkblue;
`;

export const StyledMovieContainer = styled.div`
  color: white;
  background-color: tan;
  display: flex;
  height: 100%;
  flex-direction: column;
`;

export const StyledMovieCategory = styled.div`
  h1 {
    font-size: larger;
    font-weight: bold;
  }
`;

export const StyledMovieInformationImage = styled.div`
  background-image: url(${({ image }: { image: string }) => image});
`;
