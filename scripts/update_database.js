const fs = require("fs");
const path = require("path");
const logger = require("../backend/logger");
const { saveSetsAndCards, getDataDir } = require("../backend/data");
const doSet = require("../backend/import/doSet");
const {oclMongo} = require("ocl-data");

const updateDatabase = async () => {
  const mongo = await oclMongo();
  await mongo.collection("all_cards").deleteMany({});
  let allCards = {};
  const allSets = {};

  // Add normal sets
  const setsToIgnore = ["ITP", "CP1", "CP2", "CP3"];

  const setsDataDir = path.join(getDataDir(), "sets");
  if (fs.existsSync(setsDataDir)) {
    const files = fs.readdirSync(setsDataDir);
    for (const file of files) {
      if (!/.json/g.test(file)) {
        continue;
      }
      const [setName,] = file.split(".");
      if (setsToIgnore.includes(setName)) {
        continue;
      }
      const filePath = path.join(setsDataDir, `${file}`);
      try {
        const json = JSON.parse(fs.readFileSync(filePath, "UTF-8"));
        if (json.code) {
          logger.info(`Found set to integrate ${json.code} with path ${filePath}`);
          const {set, cards, rawCards} = doSet(json);
          if (rawCards.length > 0) {
            await mongo.collection("all_cards").insertMany(rawCards);
          }

          allSets[json.code] = set;
          allCards = { ...allCards, ...cards};
          logger.info(`Parsing ${json.code} finished`);
        } else {
          logger.warn(`Set ${json.name} with path ${filePath} will NOT BE INTEGRATED`);
        }
      } catch (err) {
        logger.error(`Error while integrating the file ${filePath}: ${err.stack}`);
      }
    }
  }
  // Add custom sets
  const customDataDir = path.join(getDataDir(), "custom");
  if (fs.existsSync(customDataDir)) {
    const files = fs.readdirSync(customDataDir);
    files.forEach(file => {
      // Integrate only json file
      if (/.json/g.test(file)) {
        const filePath = path.join(customDataDir, `${file}`);
        try {
          const json = JSON.parse(fs.readFileSync(filePath, "UTF-8"));
          if (json.code) {
            json.type = "custom";
            logger.info(`Found custom set to integrate ${json.code} with path ${filePath}`);
            const {set, cards} = doSet(json);
            allSets[json.code] = set;
            allCards = { ...allCards, ...cards };
            logger.info(`Parsing ${json.code} finished`);
          }
        } catch (err) {
          logger.error(`Error while integrating the file ${filePath}: ${err.stack}`);
        }
      }
    });
  }

  logger.info("Parsing AllSets.json finished");
  await saveSetsAndCards(allSets, allCards);
  await mongo.collection("all_cards").createIndex("uuid");
  await mongo.collection("all_cards").createIndex("name");
  await mongo.collection("all_cards").createIndex("mtgoId");

  logger.info("Writing sets.json and cards.json finished");
};

module.exports = updateDatabase;

if (!module.parent) {
  updateDatabase();
}
