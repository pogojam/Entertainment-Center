// import * as imdb from "imdb-api";

//@ts-ignore
const apiKey = import.meta.env.VITE_IMDB_KEY;
const timeout = 3000;

// const cli = new imdb.Client({ apiKey });

export const getMovie = async (name: string) => {
  // return cli.get({ name });
};
