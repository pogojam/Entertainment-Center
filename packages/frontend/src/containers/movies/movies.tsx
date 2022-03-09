import { useEffect } from "react";
import { getMovie } from "../../imdb";
import {
  StyledMovieCategory,
  StyledMovieContainer,
  StyledMovieInformationImage,
  StyledMovieInformationPane,
  StyledMovieSelectionPane,
} from "./movies.styles";

console.log(await getMovie("the matrix"));

const MockMovies = [
  {
    title: "The Matrix",
    genre: "Action",
    image:
      "https://m.media-amazon.com/images/M/MV5BMGJkNDJlZW…MzQxMTIxNWNmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
  },
];

const MockCategories = [
  {
    title: "Action Films",
    movies: [...MockMovies],
  },
];

const MovieInformation = ({
  title,
  image,
}: {
  title: string;
  image: string;
}) => {
  return (
    <StyledMovieInformationImage image={image}></StyledMovieInformationImage>
  );
};

const MovieCategory = ({
  title,
  movies,
}: {
  title: string;
  movies: Array<any>;
}) => {
  return (
    <StyledMovieCategory>
      <div>
        <h1>{title}</h1>
      </div>
      {movies.map((movie) => (
        <MovieInformation {...movie}></MovieInformation>
      ))}
    </StyledMovieCategory>
  );
};

export const MoviesContainer = () => {
  return (
    <StyledMovieContainer>
      <StyledMovieInformationPane></StyledMovieInformationPane>
      <StyledMovieSelectionPane>
        {MockCategories.map((category) => (
          <MovieCategory {...category} />
        ))}
      </StyledMovieSelectionPane>
    </StyledMovieContainer>
  );
};
