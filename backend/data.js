const fs = require("fs");
const path = require("path");
const readFile = (path) => JSON.parse(fs.readFileSync(path, "UTF-8"));
const { keyCardsUuidByName, groupCardsByName } = require("./import/keyCards");

const DATA_DIR = "data";
const CARDS_PATH = "cards.json";
const CUBABLE_CARDS_PATH = "cubable_cards_by_name.json";
const SETS_PATH = "sets.json";

let cards, cubableCardsByName;

const getDataDir = () => {
  const repoRoot = process.cwd();
  const dataDir = path.join(repoRoot, DATA_DIR);
  return dataDir;
};

const reloadData = (filename) => {
  switch (filename) {
  case CARDS_PATH: {
    cards = null;
    break;
  }
  case CUBABLE_CARDS_PATH: {
    cubableCardsByName = null;
    break;
  }
  }
};

const getCards = () => {
  if (!cards) {
    cards = readFile(`${getDataDir()}/${CARDS_PATH}`);
  }
  return cards;
};

const mergeCardsTogether = (oldCards, newCards) => ({
  ...oldCards,
  ...newCards
});

const saveSetsAndCards = (allSets, allCards) => {
  writeSets(allSets);
  writeCards(allCards);
  writeCubeCards(allSets, allCards);
};

const getCardByUuid = (uuid) => {
  return getCards()[uuid];
};

const getCubableCardByName = (cardName) => {
  if (!cubableCardsByName) {
    cubableCardsByName = readFile(`${getDataDir()}/${CUBABLE_CARDS_PATH}`);
  }
  return getCardByUuid(cubableCardsByName[cardName]);
};

const writeCards = (newCards) => {
  fs.writeFileSync(`${getDataDir()}/${CARDS_PATH}`, JSON.stringify(newCards, undefined, 4));
};

const sortByPriority = allSets => (card1, card2) => {
  const set1 = allSets[card1.setCode];
  const set2 = allSets[card2.setCode];

  if (isReleasedExpansionOrCoreSet(set1.type, set1.releaseDate)) {
    if(isReleasedExpansionOrCoreSet(set2.type, set2.releaseDate)) {
      return new Date(set2.releaseDate).getMilliseconds() - new Date(set1.releaseDate).getMilliseconds();
    } else {
      return -1;
    }
  } else if(isReleasedExpansionOrCoreSet(set2.type, set2.releaseDate)) {
    return 1;
  }

  return 0;
};

const writeCubeCards = (allSets, allCards) => {
  const groupedCards = groupCardsByName(Object.values(allCards));
  const groupedCardsArray = Object.values(groupedCards);
  const mySort = sortByPriority(allSets);
  groupedCardsArray.forEach((cards) => {
    cards.sort(mySort);
  });

  const cubableCards = groupedCardsArray
    .map((cards) => cards[0]) // take the first card of each group
    .flatMap((card) => {
      const names = card.name.split(" // ");
      const arr = (names.length > 1) ? [card] : [];
      return arr.concat(names.map((name) => ({
        ...card,
        name
      })));
    });
  cubableCardsByName = keyCardsUuidByName(cubableCards);
  fs.writeFileSync(`${getDataDir()}/${CUBABLE_CARDS_PATH}`, JSON.stringify(cubableCardsByName, undefined, 4));
};

const writeSets = (newSets) => {
  fs.writeFileSync(`${getDataDir()}/${SETS_PATH}`, JSON.stringify(newSets, undefined, 4));
};

const isReleasedExpansionOrCoreSet = (type, releaseDate) => (
  ["expansion", "core"].includes(type) &&
  Date.parse(releaseDate) <= new Date()
);

module.exports = {
  saveSetsAndCards,
  getDataDir,
  getCards,
  mergeCardsTogether,
  getCardByUuid,
  getCardByName: getCubableCardByName,
  reloadData
};
