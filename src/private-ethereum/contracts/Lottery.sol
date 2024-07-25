// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Lottery {
    address public owner;
    address[] public players;
    uint256 public ticketPrice;
    address public winner;
    
    enum LotteryState { Open, Closed, PickingWinner }
    LotteryState public lotteryState;

    mapping(address => bool) private hasEntered;

    event LotteryEntered(address indexed player);
    event WinnerPicked(address indexed winner);

    constructor() {
        owner = msg.sender;
        ticketPrice = 0.5 ether;
        lotteryState = LotteryState.Closed;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier lotteryOpen() {
        require(lotteryState == LotteryState.Open, "Lottery is not open");
        _;
    }

    function startLottery() external onlyOwner {
        require(lotteryState == LotteryState.Closed, "Can't start a new lottery yet");
        lotteryState = LotteryState.Open;
    }

    function enterLottery() external payable lotteryOpen {
        require(msg.sender != owner, "Owner can't participate");
        require(msg.value >= ticketPrice, "Not enough ETH sent to enter lottery");
        require(!hasEntered[msg.sender], "You can only enter once per round");

        players.push(msg.sender);
        hasEntered[msg.sender] = true;
        emit LotteryEntered(msg.sender);
    }

    function endLottery() external onlyOwner {
        require(lotteryState == LotteryState.Open, "Lottery is not open");
        require(players.length >= 3, "Not enough players to end the lottery");

        lotteryState = LotteryState.PickingWinner;
        pickWinner();
    }

    function pickWinner() internal onlyOwner {
        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp, 
                    block.difficulty,
                    players.length
                )
            )
        ) % players.length;
        winner = players[randomIndex];
        payable(winner).transfer(address(this).balance);

        emit WinnerPicked(winner);

        for (uint i = 0; i < players.length; i++) {
            hasEntered[players[i]] = false;
        }
        delete players;
        lotteryState = LotteryState.Closed;
    }

    receive() external payable {}
}
