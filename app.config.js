import "dotenv/config";

export default {
  expo: {
    name: "movieapp",
    slug: "movieapp",
    extra: {
      OMDB_API_KEY: process.env.OMDB_API_KEY,
    },
  },
};
