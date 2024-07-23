const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { LotteryContract } = require('../lib/lottery');

chai.use(sinonChai);
const { expect } = chai;

describe('LotteryContract', () => {
  let sandbox;
  let stub;
  let ctx;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    stub = sandbox.createStubInstance(ChaincodeStub);
    ctx = {
      stub,
      clientIdentity: sandbox.createStubInstance(ClientIdentity),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#startLottery', () => {
    it('should start the lottery if it is closed', async () => {
      const lottery = new LotteryContract();

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify({ state: 'CLOSED' })));
      ctx.stub.putState.resolves();

      await lottery.startLottery(ctx);

      const state = stub.putState.getCall(0).args[1];
      expect(state.toString()).to.include('"state":"OPEN"');
    });

    it('should not start the lottery if it is already open', async () => {
      const lottery = new LotteryContract();

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify({ state: 'OPEN' })));

      try {
        await lottery.startLottery(ctx);
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).to.equal("Can't start a new lottery yet");
        } else {
          throw err;
        }
      }
    });
  });

  describe('#enterLottery', () => {
    it('should allow a user to enter the lottery', async () => {
      const lottery = new LotteryContract();

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify({ state: 'OPEN', players: [] })));
      ctx.stub.putState.resolves();

      ctx.stub.getArgs.returns(['', '100']);
      ctx.clientIdentity.getID.returns('User1');

      await lottery.enterLottery(ctx);

      const state = stub.putState.getCall(0).args[1];
      expect(state.toString()).to.include('"players":["User1"]');
    });

    it('should not allow entering the lottery if it is closed', async () => {
      const lottery = new LotteryContract();

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify({ state: 'CLOSED' })));

      try {
        ctx.stub.getArgs.returns(['', '100']);
        ctx.clientIdentity.getID.returns('User1');
        await lottery.enterLottery(ctx);
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).to.equal('Lottery is not open');
        } else {
          throw err;
        }
      }
    });

    it('should not allow entering the lottery with insufficient points', async () => {
      const lottery = new LotteryContract();

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify({ state: 'OPEN', players: [] })));

      try {
        ctx.stub.getArgs.returns(['', '50']);
        ctx.clientIdentity.getID.returns('User1');
        await lottery.enterLottery(ctx);
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).to.equal('Not enough points to enter the lottery');
        } else {
          throw err;
        }
      }
    });
  });

  describe('#endLottery', () => {
    it('should end the lottery if there are enough players', async () => {
      const lottery = new LotteryContract();

      const lotteryState = {
        state: 'OPEN',
        players: ['User1', 'User2', 'User3'],
        owner: 'Owner',
      };

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify(lotteryState)));
      ctx.clientIdentity.getID.returns('Owner');

      await lottery.endLottery(ctx);

      const state = stub.putState.getCall(0).args[1];
      expect(state.toString()).to.include('"state":"PICKING_WINNER"');
    });

    it('should not end the lottery if there are not enough players', async () => {
      const lottery = new LotteryContract();

      const lotteryState = {
        state: 'OPEN',
        players: ['User1', 'User2'],
        owner: 'Owner',
      };

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify(lotteryState)));
      ctx.clientIdentity.getID.returns('Owner');

      try {
        await lottery.endLottery(ctx);
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).to.equal('Not enough players to end the lottery');
        } else {
          throw err;
        }
      }
    });
  });

  describe('#pickWinner', () => {
    it('should pick a winner if the lottery is in picking winner state', async () => {
      const lottery = new LotteryContract();

      const lotteryState = {
        state: 'PICKING_WINNER',
        players: ['User1', 'User2', 'User3'],
        owner: 'Owner',
      };

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify(lotteryState)));
      ctx.stub.putState.resolves();
      ctx.clientIdentity.getID.returns('Owner');

      await lottery.pickWinner(ctx);

      const state = stub.putState.getCall(0).args[1];
      expect(state.toString()).to.include('"state":"CLOSED"');
      expect(state.toString()).to.include('"players":[]');
    });

    it('should not pick a winner if the lottery is not in picking winner state', async () => {
      const lottery = new LotteryContract();

      ctx.stub.getState
        .withArgs('lottery')
        .resolves(Buffer.from(JSON.stringify({ state: 'CLOSED' })));

      ctx.clientIdentity.getID.returns('Owner');
      try {
        await lottery.pickWinner(ctx);
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).to.equal('Not picking winner now');
        } else {
          throw err;
        }
      }
    });
  });
});
