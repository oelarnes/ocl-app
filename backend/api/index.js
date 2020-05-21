
const express = require("express");
const games = require("./games");
const sets = require("./sets");
const { oclData } = require("ocl-data");
const apiRouter = express.Router();
const fs = require("fs");

const oclEvents = express.Router().get("/", (_, res) => {
  // this responds with names of empty event folders
  fs.readdir("data/events", (_err, files) => {
    Promise.all(files.map(file => fs.promises.readdir("data/events/" + file)))
      .then(fileSets => {
        const empties = files.filter((_, index) => fileSets[index].length === 0);
        res.json(empties);
      });
  });
});

apiRouter
  .use("/games", games)
  .use("/sets", sets)
  .use("/data", oclData)
  .use("/events", oclEvents);

module.exports = apiRouter;
