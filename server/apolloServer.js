const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const cors = require("cors");
const { authMiddleware } = require("./utils/auth");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start Apollo Server and Express App
const startApolloServer = async () => {
  await server.start();

  // // CORS - allow client requests (adjust origins for production)
  // app.use(
  //   cors({
  //     origin: [
  //       "http://localhost:3000", // local React app

  //     ], // replace with your actual frontend URLs
  //     credentials: true,
  //   })
  // );

  // Middleware for parsing requests
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors()); // this will help when we deploy to Render

  // GraphQL endpoint with auth middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );


  // Serve frontend in production
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  // Wait for DB before starting server
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  });
};

// Start the server
startApolloServer();
