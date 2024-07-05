const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Lottery contract', () => {
  let Lottery;
  let lottery;
  let owner;
  let address1;
  let address2;
  let address3;
  let addresses;

  beforeEach(async () => {
    // Get the ContractFactory and Signers
    Lottery = await ethers.getContractFactory('Lottery');
    [owner, address1, address2, address3, ...addresses] = await ethers.getSigners();

    // Deploy the contract
    lottery = await Lottery.deploy();
    await lottery.deployed();
  });

  describe('Deployment', () => {
    it('should set the right owner', async () => {
      expect(await lottery.owner()).to.equal(owner.address);
    });

    it('should have correct initial state', async () => {
      expect(await lottery.lotteryState()).to.equal(1);
    });

    it('should set the ticket price correctly', async () => {
      expect(await lottery.ticketPrice()).to.equal(ethers.utils.parseEther('0.5'));
    });
  });

  describe('Starting lottery', () => {
    it('should allow the owner to start the lottery', async () => {
      await lottery.startLottery();
      expect(await lottery.lotteryState()).to.equal(0);
    });
  });

  describe('Entering lottery', () => {
    beforeEach(async () => {
      await lottery.startLottery();
    });

    it('Should allow a player to enter the lottery', async () => {
      await lottery
        .connect(address1)
        .enterLottery({ value: ethers.utils.parseEther('0.5') });
      expect(await lottery.players(0)).to.equal(address1.address);
    });
  });

  describe('Ending lottery', () => {
    beforeEach(async () => {
      await lottery.startLottery();
      await lottery
        .connect(address1)
        .enterLottery({ value: ethers.utils.parseEther('0.5') });
      await lottery
        .connect(address2)
        .enterLottery({ value: ethers.utils.parseEther('0.5') });
    });

    it('Should allow the owner to end the lottery', async () => {
      await lottery
        .connect(address3)
        .enterLottery({ value: ethers.utils.parseEther('0.5') });
      await lottery.endLottery();
      expect(await lottery.lotteryState()).to.equal(2);
    });
  });

  describe('Picking winner', () => {
    beforeEach(async () => {
      await lottery.startLottery();
      await lottery
        .connect(address1)
        .enterLottery({ value: ethers.utils.parseEther('0.5') });
      await lottery
        .connect(address2)
        .enterLottery({ value: ethers.utils.parseEther('0.5') });
      await lottery
        .connect(address3)
        .enterLottery({ value: ethers.utils.parseEther('0.5') });
      await lottery.endLottery();
    });

    it('Should pick a winner and transfer the balance', async () => {
      await ethers.provider.getBalance(address1.address);
      await lottery.pickWinner();
      await ethers.provider.getBalance(address1.address);
      expect(await lottery.lotteryState()).to.equal(1);
      expect(await ethers.provider.getBalance(lottery.address)).to.equal(0);
    });

    it('Should reset the lottery after picking a winner', async () => {
      await lottery.pickWinner();
      expect(await lottery.lotteryState()).to.equal(1);
      expect(await lottery.players.length).to.equal(0);
    });
  });
});
