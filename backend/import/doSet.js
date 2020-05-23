const toBoosterCard = require("./toBoosterCard");
const { keyCardsUuidByNumber, groupCardsUuidByRarity, keyCardsByUuid} = require("./keyCards");

function doSet({code, baseSetSize, name, type, releaseDate, boosterV3, cards: mtgJsonCards}) {
  const rawCards = mtgJsonCards
    .filter((card) => !card.isAlternative).map(card => ({...card, setCode: code}));
  const cards = rawCards
    .map(toBoosterCard);
  const size = !boosterV3 ? 4 : boosterV3.filter(x => x === "common").length;

  return {
    set: {
      code,
      name,
      type,
      releaseDate,
      baseSetSize,
      size,
      cardsByNumber: keyCardsUuidByNumber(cards),
      ...groupCardsUuidByRarity(cards),
    },
    cards: keyCardsByUuid(cards),
    rawCards
  };
}

module.exports = doSet;
