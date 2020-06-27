var SafeMath = artifacts.require('./SafeMath.sol');
var MovementToken = artifacts.require('./MovementToken.sol');

var ERC20DemoToken = artifacts.require('./helpers/ERC20Demo');
var ERC20DemoCallBackToken = artifacts.require('./helpers/ERC20DemoCallBack');

module.exports = function (deployer) {
    deployer.deploy(SafeMath);
    deployer.deploy(MovementToken, 15, 0);

    //for test contracts
    deployer.deploy(ERC20DemoToken, "");
    deployer.deploy(ERC20DemoCallBackToken, "");
};
