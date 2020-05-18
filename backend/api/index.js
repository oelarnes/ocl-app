
const express = require("express");
const games = require("./games");
const sets = require("./sets");
const cubes = require("./cubes");
const { oclData } = require("ocl-data");
const apiRouter = express.Router();

apiRouter
  .use("/games", games)
  .use("/sets", sets)
  .use("/cubes", cubes)
  .use("/data", oclData)

module.exports = apiRouter;
