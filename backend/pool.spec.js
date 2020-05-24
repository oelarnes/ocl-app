/* eslint-env node, mocha */

const assert = require("assert");
const Pool = require("./pool");
const {times, constant} = require("lodash");

const assertPackIsCorrect = (got) => {
  const cardIds = new Set();
  let expectedCardsSize = 0;
  got.forEach(pool => pool.forEach(card => {
    assert(card.name !== undefined);
    assert(card.cardId !== undefined);
    cardIds.add(card.cardId);
    expectedCardsSize++;
  }));
  assert.equal(cardIds.size, expectedCardsSize, "cards should all have a unique ID");
};

describe("Acceptance tests for Pool class", () => {
  describe("can make a cube pool", () => {
    it("should return a sealed cube pool with length equal to player length", () => {
      const cubeList = times(720, constant("island"));
      const playersLength = 8;
      const playerPoolSize = 90;
      const got = Pool.SealedCube({cubeList, playersLength, playerPoolSize});
      assert.equal(got.length, playersLength);
      assertPackIsCorrect(got);
    });

    it("should return a draft cube pool with length equal to player length per playersPack", () => {
      const cubeList = times(720, constant("island"));
      const playersLength = 8;
      const packsNumber = 3;
      const playerPackSize = 15;
      const got = Pool.DraftCube({cubeList, playersLength, packsNumber, playerPackSize});
      assert.equal(got.length, playersLength * packsNumber);
      assertPackIsCorrect(got);
    });
  });
});
