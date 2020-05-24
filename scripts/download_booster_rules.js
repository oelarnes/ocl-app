const axios = require("axios");
const logger = require("../backend/logger");
const {getBoosterRulesVersion, getCardByUuid, getSet, saveBoosterRules} = require("../backend/data");

const URL = "https://raw.githubusercontent.com/taw/magic-sealed-data/master/sealed_basic_data.json";
const REPO_URL = "https://api.github.com/repos/taw/magic-sealed-data/git/refs/heads/master";


const whitelistSets = ["2ED", "9ED", "DIS", "WWK", "MRD", "ME2", "ME4", "MMA", "THS", "RAV", "ROE", "UDS", "5DN", "AER", "EXO", "MOR", "IKO", "USG",
  "EMA", "FUT", "ME1", "PZ2", "DST", "DGM", "RIX", "M13", "TMP", "SCG", "BFZ", "ZEN", "VIS", "M19", "LGN", "SOK", "M10", "BNG", "8ED", "RNA",
  "EVE", "SOM", "CMD", "DDF", "CON", "INV", "DOM", "XLN", "MIR", "AVR", "JUD", "SHM", "TD2", "TOR", "PZ1", "GTC", "SOI", "BBD", "PLS", "RTR",
  "APC", "ORI", "IMA", "PC2", "LRW", "7ED", "M15", "M11", "KLD", "C14", "C19", "MBS", "ELD", "TD0", "ONS", "GRN", "AKH", "OGW", "WAR", "THB",
  "M12", "C13", "MH1", "10E", "NPH", "STH", "GPT", "WTH", "PLC", "M20", "KTK", "A25", "ALA", "ODY", "ULG", "EXP", "HOU", "NEM", "ISD", "TSP",
  "ARB", "MM2", "DTK", "TPR", "CHK", "M14", "ME3", "TSB", "VMA", "BOK", "LEA", "DKA", "PRM", "JOU", "MMQ", "EMN", "FRF", "CSP"
];

async function fetch() {
  logger.info("Checking boosterRules repository");
  const repo = await axios.get(REPO_URL);
  const sha = repo.data.object.sha;
  if (getBoosterRulesVersion() === sha) {
    logger.info("found same boosterRules. Skip new download");
    return;
  }
  logger.info("Downloading new boosterRules");
  const resp = await axios.get(URL);
  const rules = resp.data.reduce((acc, { code, boosters, sheets }) => {
    const totalWeight = boosters.reduce((acc, { weight }) => acc + weight, 0);
    if (!whitelistSets.includes(code.toUpperCase())) {
      return acc;
    }
    acc[code.toUpperCase()] = {
      totalWeight,
      boosters,
      sheets: Object.entries(sheets).reduce((acc, [code, {balance_colors = false, cards}]) => {
        const totalWeight = Object.values(cards).reduce((acc, val) => acc + val, 0);
        acc[code] = {
          balance_colors,
          totalWeight,
          cards: Object.entries(cards).reduce((acc, [cardCode, weigth]) => {
            const uuid = getUuid(cardCode);
            acc[uuid] = weigth;
            return acc;
          },{}),
          cardsByColor: Object.entries(cards).reduce((acc, [cardCode]) => {
            try {
              const {uuid, colorIdentity, type} = getCard(cardCode);
              if (type === "Land" || colorIdentity.length === 0) {
                (acc["c"] = acc["c"] || []).push(uuid);
              } else {
                colorIdentity.forEach((color) => {
                  (acc[color] = acc[color] || []).push(uuid);
                });
              }
            } catch(err) {
              logger.warn(cardCode + " doesn't match any card");
            }
            return acc;
          },{})
        };
        return acc;
      }, {}),
    };

    return acc;
  }, {});
  rules.repoHash = sha;
  logger.info("Saving boosterRules");
  saveBoosterRules(rules);
  logger.info("Finished saving boosterRules");
}

const getCard = (cardCode) => {
  const uuid = getUuid(cardCode);
  return getCardByUuid(uuid);
};

const getUuid = (cardCode) => {
  const [setCode, cardNumber] = cardCode.split(":");
  const { cardsByNumber } = getSet(setCode.toUpperCase());
  return cardsByNumber[cardNumber] || cardsByNumber[parseInt(cardNumber)] || cardsByNumber[cardNumber.toLowerCase()];
};

module.exports = fetch;

//Allow this script to be called directly from commandline.
if (!module.parent) {
  fetch();
}
