// Change this to true ONLY when you host your backend on the internet
let IS_PROD = false;

const server = IS_PROD
  ? "https://conferax-api.onrender.com" // <-- Your future live backend URL will go here!
  : "http://localhost:8000"; // <-- Your current local development server

export default server;
