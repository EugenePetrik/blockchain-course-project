const { Contract } = require('fabric-contract-api');

class LotteryContract extends Contract {
  constructor() {
    super('LotteryContract');
    this.lottery = {
      ticketPrice: 100,
      players: [],
      state: 'CLOSED',
      winner: null,
    };
  }

  async startLottery(ctx) {
    const lotteryAsBytes = await ctx.stub.getState('lottery');

    if (lotteryAsBytes && lotteryAsBytes.length > 0) {
      this.lottery = JSON.parse(lotteryAsBytes.toString());
      if (this.lottery.state !== 'CLOSED') {
        throw new Error("Can't start a new lottery yet");
      }
    }

    this.lottery.state = 'OPEN';
    await ctx.stub.putState('lottery', Buffer.from(JSON.stringify(this.lottery)));
  }

  async enterLottery(ctx) {
    const lotteryAsBytes = await ctx.stub.getState('lottery');

    if (!lotteryAsBytes || lotteryAsBytes.length === 0) {
      throw new Error('Lottery not initialized');
    }

    this.lottery = JSON.parse(lotteryAsBytes.toString());

    if (this.lottery.state !== 'OPEN') {
      throw new Error('Lottery is not open');
    }

    const ticketPrice = parseInt(ctx.stub.getArgs()[1], 10);

    if (ticketPrice < 100) {
      throw new Error('Not enough points to enter the lottery');
    }

    const userId = ctx.clientIdentity.getID();

    if (this.lottery.players.includes(userId)) {
      throw new Error('User already entered the lottery');
    }

    this.lottery.players.push(userId);
    await ctx.stub.putState('lottery', Buffer.from(JSON.stringify(this.lottery)));
  }

  async endLottery(ctx) {
    const lotteryAsBytes = await ctx.stub.getState('lottery');

    if (!lotteryAsBytes || lotteryAsBytes.length === 0) {
      throw new Error('Lottery not initialized');
    }

    this.lottery = JSON.parse(lotteryAsBytes.toString());
    const clientId = ctx.clientIdentity.getID();

    if (clientId !== this.lottery.owner) {
      throw new Error('Only the owner can end the lottery');
    }

    if (this.lottery.players.length < 3) {
      throw new Error('Not enough players to end the lottery');
    }

    this.lottery.state = 'PICKING_WINNER';
    await ctx.stub.putState('lottery', Buffer.from(JSON.stringify(this.lottery)));
  }

  async pickWinner(ctx) {
    const lotteryAsBytes = await ctx.stub.getState('lottery');

    if (!lotteryAsBytes || lotteryAsBytes.length === 0) {
      throw new Error('Lottery not initialized');
    }

    this.lottery = JSON.parse(lotteryAsBytes.toString());
    const clientId = ctx.clientIdentity.getID();

    if (clientId !== this.lottery.owner) {
      throw new Error('Only the owner can pick a winner');
    }

    if (this.lottery.state !== 'PICKING_WINNER') {
      throw new Error('Not picking winner now');
    }

    const randomIndex = Math.floor(Math.random() * this.lottery.players.length);
    this.lottery.winner = this.lottery.players[randomIndex];
    this.lottery.state = 'CLOSED';
    this.lottery.players = [];

    await ctx.stub.putState('lottery', Buffer.from(JSON.stringify(this.lottery)));
  }
}

module.exports = { LotteryContract };
