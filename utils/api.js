import axios from "axios";
import Constants from "expo-constants";

const API_KEY = Constants.expoConfig?.extra?.OMDB_API_KEY;
const BASE_URL = "https://www.omdbapi.com/";

export const fetchMoviesYear = async (year) => {
  const res = await axios.get(
    `${BASE_URL}?apikey=${API_KEY}&s=movie&y=${year}&type=movie&page=1`
  );
  return res.data.Search || [];
};

export const fetchSeriesList = async () => {
  const res = await axios.get(
    `${BASE_URL}?apikey=${API_KEY}&s=series&type=series&page=1`
  );
  return res.data.Search || [];
};

export const fetchMovieDetail = async (id) => {
  const res = await axios.get(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
  return res.data;
};

export const fetchMoviesPage = async (page = 1) => {
  const res = await axios.get(
    `${BASE_URL}?apikey=${API_KEY}&s=movie&page=${page}`
  );
  return res.data.Search || [];
};

export const searchMovieApi = async (query) => {
  const res = await axios.get(`${BASE_URL}?apikey=${API_KEY}&s=${query}`);
  return res.data.Search || [];
};
