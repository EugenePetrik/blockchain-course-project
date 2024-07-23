// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Lottery {
    address public owner;
    address[] public players;
    uint256 public ticketPrice;
    address public winner;
    
    enum LotteryState { Open, Closed, PickingWinner }
    LotteryState public lotteryState;

    event LotteryEntered(address indexed player);  // Event to log when a player enters the lottery
    event WinnerPicked(address indexed winner);  // Event to log when a winner is picked

    constructor() {
        owner = msg.sender;
        ticketPrice = 0.5 ether;
        lotteryState = LotteryState.Closed;
    }

    // Modifier to restrict functions to only the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Modifier to restrict functions to when the lottery is open
    modifier lotteryOpen() {
        require(lotteryState == LotteryState.Open, "Lottery is not open");
        _;
    }

    // Function to start the lottery, callable only by the owner
    function startLottery() external onlyOwner {
        require(lotteryState == LotteryState.Closed, "Can't start a new lottery yet");
        lotteryState = LotteryState.Open;
    }

    // Function to enter the lottery by sending Ether, callable only when the lottery is open
    function enterLottery() external payable lotteryOpen {
        require(msg.sender != owner, "Owner can't participate");
        require(msg.value >= ticketPrice, "Not enough ETH sent to enter lottery");
        
        players.push(msg.sender);
        emit LotteryEntered(msg.sender);
    }

    // Function to end the lottery, callable only by the owner
    function endLottery() external onlyOwner {
        require(lotteryState == LotteryState.Open, "Lottery is not open");
        require(players.length >= 3, "Not enough players to end the lottery");

        lotteryState = LotteryState.PickingWinner;
        pickWinner();
    }

    // Internal function to pick a winner using a pseudorandom method
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

        // Reset the lottery
        delete players;
        lotteryState = LotteryState.Closed;
    }

    // Fallback function to receive Ether
    receive() external payable {}
}
