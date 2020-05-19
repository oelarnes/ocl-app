
const express = require("express");
const games = require("./games");
const sets = require("./sets");
const { oclData } = require("ocl-data");
const apiRouter = express.Router();

apiRouter
  .use("/games", games)
  .use("/sets", sets)
  .use("/data", oclData)

module.exports = apiRouter;
