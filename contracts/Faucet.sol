// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./IFaucet.sol";

contract Faucet is Owned, IFaucet {

    uint public fundersCount;
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    modifier limitWithdraw(uint withdrawAmount) {

        require(
            withdrawAmount <= 100000000000000000, 
            "Cannot withdraw more than 0.1 ether."
        );
        _;
    } 
    
    receive() external payable {}

    function addFunds() override external payable {

        address funder = msg.sender;

        if(!funders[funder]) {
            uint index = fundersCount++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function withdraw(uint withdrawAmount) override external limitWithdraw(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](fundersCount);

        for(uint i = 0; i < fundersCount; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns(address) {
        return lutFunders[index];
    }

}