pragma solidity ^0.5.16;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MovementToken.sol";

contract TestMovementToken {

  function testInitialBalanceUsingDeployedContract() public {
	  MovementToken meta = MovementToken(DeployedAddresses.MovementToken());

	  uint256 expected = 0;
	  uint256 totalSupply = 3000000;

	  Assert.equal(meta.balanceOf(tx.origin), expected, "Owner should have 0 MovementToken initially");
	  Assert.equal(meta.totalSupply(), totalSupply, "Incorrect totalSupply");
  }


}