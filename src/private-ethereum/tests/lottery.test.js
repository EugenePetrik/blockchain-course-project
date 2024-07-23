const axios = require('axios');
const { expect } = require('chai');

require('dotenv').config();

const { KALEIDO_API_URL, KALEIDO_API_KEY, CONTRACT_ADDRESS } = process.env;

const axiosInstance = axios.create({
  baseURL: KALEIDO_API_URL,
  headers: {
    Authorization: `Bearer ${KALEIDO_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

describe('Lottery Contract API Tests', () => {
  it('should start the lottery', async () => {
    const response = await axiosInstance.post('/transactions', {
      from: 'owner-address', // Replace with actual owner address
      to: CONTRACT_ADDRESS,
      data: '0x' + 'startLottery', // Replace with actual data to call startLottery
    });

    expect(response.status).to.equal(200);
  });

  it('should allow a user to enter the lottery', async () => {
    const response = await axiosInstance.post('/transactions', {
      from: 'user-address', // Replace with actual user address
      to: CONTRACT_ADDRESS,
      value: '0.5 ether', // Replace with actual ticket price
      data: '0x' + 'enterLottery', // Replace with actual data to call enterLottery
    });

    expect(response.status).to.equal(200);
  });

  it('should not allow the owner to enter the lottery', async () => {
    try {
      await axiosInstance.post('/transactions', {
        from: 'owner-address', // Replace with actual owner address
        to: CONTRACT_ADDRESS,
        value: '0.5 ether', // Replace with actual ticket price
        data: '0x' + 'enterLottery', // Replace with actual data to call enterLottery
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.message).to.equal("Owner can't participate");
    }
  });

  it('should not allow a user to enter the lottery twice', async () => {
    // First entry
    await axiosInstance.post('/transactions', {
      from: 'user-address', // Replace with actual user address
      to: CONTRACT_ADDRESS,
      value: '0.5 ether', // Replace with actual ticket price
      data: '0x' + 'enterLottery', // Replace with actual data to call enterLottery
    });

    // Attempt to enter again
    try {
      await axiosInstance.post('/transactions', {
        from: 'user-address', // Replace with actual user address
        to: CONTRACT_ADDRESS,
        value: '0.5 ether', // Replace with actual ticket price
        data: '0x' + 'enterLottery', // Replace with actual data to call enterLottery
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.message).to.equal('User already entered the lottery');
    }
  });

  it('should end the lottery', async () => {
    const response = await axiosInstance.post('/transactions', {
      from: 'owner-address', // Replace with actual owner address
      to: CONTRACT_ADDRESS,
      data: '0x' + 'endLottery', // Replace with actual data to call endLottery
    });

    expect(response.status).to.equal(200);
  });

  it('should not allow ending the lottery with fewer than 3 players', async () => {
    const response = await axiosInstance.post('/transactions', {
      from: 'owner-address', // Replace with actual owner address
      to: CONTRACT_ADDRESS,
      data: '0x' + 'endLottery', // Replace with actual data to call endLottery
    });

    expect(response.status).to.equal(400);
    expect(response.data.message).to.equal('Not enough players to end the lottery');
  });

  it('should pick a winner', async () => {
    const response = await axiosInstance.post('/transactions', {
      from: 'owner-address', // Replace with actual owner address
      to: CONTRACT_ADDRESS,
      data: '0x' + 'pickWinner', // Replace with actual data to call pickWinner
    });

    expect(response.status).to.equal(200);
  });

  it('should not allow picking a winner if the lottery is not open', async () => {
    try {
      await axiosInstance.post('/transactions', {
        from: 'owner-address', // Replace with actual owner address
        to: CONTRACT_ADDRESS,
        data: '0x' + 'pickWinner', // Replace with actual data to call pickWinner
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.message).to.equal('Lottery is not open');
    }
  });
});
