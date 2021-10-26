const { expect } = require("chai");

describe("Regen tests", function () {
  let LoogiesContract;

  beforeEach(async function () {
      const Contract = await ethers.getContractFactory("Loogies");
      LoogiesContract = await Contract.deploy();
      await LoogiesContract.deployed();
  });

  describe("Loogies Contract", function () {
  //  it("Should deploy Contract", async function () {
  //    const Contract = await ethers.getContractFactory("Loogies");
  //    LoogiesContract = await Contract.deploy();
      //});

    describe("Tests", function () {
      it("Should return the name", async function () {
        expect(await LoogiesContract.name()).to.equal("Regen");
      });
  
      it("Should return the symbol", async function () {
        expect(await LoogiesContract.symbol()).to.equal("REGEN");
      });
  
    });
  });
});
