const express = require("express");
const mongoose = require("mongoose");

const graphQLMiddleware = require("./middleware/graphQLHTTP");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(authMiddleware);
app.use("/graphql", graphQLMiddleware);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(console.error);
