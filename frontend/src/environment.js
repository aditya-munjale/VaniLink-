let IS_PROD = true;

const server = IS_PROD
  ? "https://vanilink-backend.onrender.com" // <-- future live backend URL will go here!
  : "http://localhost:8000"; // <--  current local development server

export default server;
