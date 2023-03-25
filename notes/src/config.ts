// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "2minsDevsNotes";
export const SITE_DESCRIPTION =
  "Welcome to my blog of javascript enthusiast trying to prove that any JS dev is not just a pixel-mover. And when I say javascript I mean frontend, backend, testing, clouds, ML, bots etc.";
export const TWITTER_HANDLE = "@v_hadoocken";
export const MY_NAME = "Vadim Tsaregorodtsev";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
