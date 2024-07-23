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
      const lottery = JSON.parse(lotteryAsBytes.toString());
      if (lottery.state !== 'CLOSED') {
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

    const lottery = JSON.parse(lotteryAsBytes.toString());

    if (lottery.state !== 'OPEN') {
      throw new Error('Lottery is not open');
    }

    const ticketPrice = parseInt(ctx.stub.getArgs()[1], 10);

    if (ticketPrice < 100) {
      throw new Error('Not enough points to enter the lottery');
    }

    const userId = ctx.clientIdentity.getID();

    if (lottery.players.includes(userId)) {
      throw new Error('User already entered the lottery');
    }

    lottery.players.push(userId);
    await ctx.stub.putState('lottery', Buffer.from(JSON.stringify(lottery)));
  }

  async endLottery(ctx) {
    const lotteryAsBytes = await ctx.stub.getState('lottery');

    if (!lotteryAsBytes || lotteryAsBytes.length === 0) {
      throw new Error('Lottery not initialized');
    }

    const lottery = JSON.parse(lotteryAsBytes.toString());
    const clientId = ctx.clientIdentity.getID();

    if (clientId !== lottery.owner) {
      throw new Error('Only the owner can end the lottery');
    }

    if (lottery.players.length < 3) {
      throw new Error('Not enough players to end the lottery');
    }

    lottery.state = 'PICKING_WINNER';
    await ctx.stub.putState('lottery', Buffer.from(JSON.stringify(lottery)));
  }

  async pickWinner(ctx) {
    const lotteryAsBytes = await ctx.stub.getState('lottery');

    if (!lotteryAsBytes || lotteryAsBytes.length === 0) {
      throw new Error('Lottery not initialized');
    }

    const lottery = JSON.parse(lotteryAsBytes.toString());
    const clientId = ctx.clientIdentity.getID();

    if (clientId !== lottery.owner) {
      throw new Error('Only the owner can pick a winner');
    }

    if (lottery.state !== 'PICKING_WINNER') {
      throw new Error('Not picking winner now');
    }

    const randomIndex = Math.floor(Math.random() * lottery.players.length);
    lottery.winner = lottery.players[randomIndex];
    lottery.state = 'CLOSED';
    lottery.players = [];

    await ctx.stub.putState('lottery', Buffer.from(JSON.stringify(lottery)));
  }
}

module.exports = LotteryContract;
