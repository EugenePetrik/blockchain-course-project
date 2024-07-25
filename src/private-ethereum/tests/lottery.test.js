const axios = require('axios');
const { expect } = require('chai');

require('dotenv').config();

const { KALEIDO_API_URL, KALEIDO_API_KEY, CONTRACT_ADDRESS } = process.env;

const axiosInstance = axios.create({
  baseURL: `${KALEIDO_API_URL}/${CONTRACT_ADDRESS}`,
  headers: {
    Authorization: `Basic ${KALEIDO_API_KEY}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

const ownerAddress = '0x2122a7ae1b7705144f20dce6e15d1c7a7a2003da';
const participants = [
  '0x1ccc94fc4a5d55f7cadc77f83a8193e6da269d1c',
  '0xc678cd494766809fa74cc64b07af840de84c7b12',
  '0x0f0db5b5a438275c9c79c829e4a71d02cc5798e7',
  '0x01884b6a9e5e0eea4e7c31c4dc62fc67b2057c01',
  '0xea6e2c1292bf6ac23ff15682bdd33bdd4d51e06d',
];

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe('Lottery Contract API Tests', () => {
  beforeEach(async () => {
    await wait(2000);
  });

  it('Should retrieve the owner address', async () => {
    const response = await axiosInstance.get(
      `/owner`,
      {},
      {
        params: { 'kld-from': ownerAddress, 'kld-sync': true },
      },
    );

    expect(response.data.output).to.equal(ownerAddress);
  });

  it('Should prevent entering the lottery if it is not open', async () => {
    try {
      await axiosInstance.post(
        '/enterLottery',
        {},
        {
          params: {
            'kld-from': participants[2],
            'kld-ethvalue': '500000000000000000',
            'kld-sync': true,
          },
        },
      );
    } catch (error) {
      expect(error.response.data.error).to.include('Lottery is not open');
    }
  });

  it('Should start the lottery', async () => {
    const response = await axiosInstance.post(
      '/startLottery',
      {},
      {
        params: { 'kld-from': ownerAddress, 'kld-sync': true },
      },
    );

    expect(response.status).to.equal(200);
    expect(response.data.headers.type).to.equal('TransactionSuccess');
    expect(response.data.status).to.equal('1');
    expect(response.data.from).to.equal(ownerAddress);
    expect(response.data.to).to.equal(CONTRACT_ADDRESS);
    expect(response.data.cumulativeGasUsed).to.be.a('string');
    expect(response.data.gasUsed).to.be.a('string');
    expect(response.data.blockHash).to.be.a('string');
    expect(response.data.transactionHash).to.be.a('string');
  });

  it('Should prevent starting a new lottery if already open', async () => {
    try {
      await axiosInstance.post(
        '/startLottery',
        {},
        {
          params: { 'kld-from': ownerAddress, 'kld-sync': true },
        },
      );
    } catch (error) {
      expect(error.response.data.error).to.include("Can't start a new lottery yet");
    }
  });

  it('Should check the lottery state', async () => {
    const response = await axiosInstance.post(
      '/lotteryState',
      {},
      {
        params: { 'kld-from': ownerAddress, 'kld-sync': true },
      },
    );

    expect(response.status).to.equal(200);
    expect(response.data.output).to.equal('0');
  });

  it('Should allow a participant to enter the lottery', async () => {
    const response = await axiosInstance.post(
      '/enterLottery',
      {},
      {
        params: {
          'kld-from': participants[0],
          'kld-ethvalue': '500000000000000000',
          'kld-sync': true,
        },
      },
    );

    expect(response.status).to.equal(200);
    expect(response.data.headers.type).to.equal('TransactionSuccess');
    expect(response.data.status).to.equal('1');
    expect(response.data.from).to.equal(participants[0]);
    expect(response.data.to).to.equal(CONTRACT_ADDRESS);
    expect(response.data.cumulativeGasUsed).to.be.a('string');
    expect(response.data.gasUsed).to.be.a('string');
    expect(response.data.blockHash).to.be.a('string');
    expect(response.data.transactionHash).to.be.a('string');
  });

  it('Should allow a participant to enter the lottery only once per round', async () => {
    try {
      await axiosInstance.post(
        '/enterLottery',
        {},
        {
          params: {
            'kld-from': participants[0],
            'kld-ethvalue': '500000000000000000',
            'kld-sync': true,
          },
        },
      );
    } catch (error) {
      expect(error.response.data.error).to.include('You can only enter once per round');
    }
  });

  it('Should fail if not enough ETH is sent to enter lottery', async () => {
    try {
      await axiosInstance.post(
        '/enterLottery',
        {},
        {
          params: {
            'kld-from': participants[1],
            'kld-ethvalue': '100000000000000000',
            'kld-sync': true,
          },
        },
      );
    } catch (error) {
      expect(error.response.data.error).to.include(
        'Not enough ETH sent to enter lottery',
      );
    }
  });

  it('Should prevent ending the lottery if not enough players', async () => {
    try {
      await axiosInstance.post(
        '/endLottery',
        {},
        {
          params: { 'kld-from': ownerAddress, 'kld-sync': true },
        },
      );
    } catch (error) {
      expect(error.response.data.error).to.include(
        'Not enough players to end the lottery',
      );
    }
  });

  it('Should pick a winner and end the lottery', async () => {
    const participant = [participants[1], participants[2], participants[3]];

    await axiosInstance.post(
      '/enterLottery',
      {},
      {
        params: {
          'kld-from': participants[2],
          'kld-ethvalue': '500000000000000000',
          'kld-sync': true,
        },
      },
    );

    await wait(1000);

    await axiosInstance.post(
      '/enterLottery',
      {},
      {
        params: {
          'kld-from': participants[3],
          'kld-ethvalue': '500000000000000000',
          'kld-sync': true,
        },
      },
    );

    await wait(1000);

    await axiosInstance.post(
      '/enterLottery',
      {},
      {
        params: {
          'kld-from': participants[4],
          'kld-ethvalue': '500000000000000000',
          'kld-sync': true,
        },
      },
    );

    await wait(1000);

    const response = await axiosInstance.post(
      '/endLottery',
      {},
      {
        params: { 'kld-from': ownerAddress, 'kld-sync': true },
      },
    );

    expect(response.status).to.equal(200);
    expect(response.data.headers.type).to.equal('TransactionSuccess');
    expect(response.data.status).to.equal('1');
    expect(response.data.from).to.equal(ownerAddress);
    expect(response.data.to).to.equal(CONTRACT_ADDRESS);
    expect(response.data.cumulativeGasUsed).to.be.a('string');
    expect(response.data.gasUsed).to.be.a('string');
    expect(response.data.blockHash).to.be.a('string');
    expect(response.data.transactionHash).to.be.a('string');
  });

  it('Should retrieve the winner address', async () => {
    const response = await axiosInstance.post(
      '/winner',
      {},
      {
        params: { 'kld-from': ownerAddress, 'kld-sync': true },
      },
    );

    expect(response.status).to.equal(200);
    expect(response.data.output).to.be.a('string');
    expect(response.data.output).to.match(/^0x[0-9a-fA-F]{40}$/);
  });
});
