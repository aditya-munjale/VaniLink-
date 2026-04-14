let IS_PROD = true;

const server = IS_PROD
  ? "https://vanilink-backend.onrender.com" // <-- Your future live backend URL will go here!
  : "http://localhost:8000"; // <-- Your current local development server

export default server;
