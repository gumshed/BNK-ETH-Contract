var SafeMath = artifacts.require('./SafeMath.sol');
var MovementToken = artifacts.require('./MovementToken.sol');

var ERC20DemoToken = artifacts.require('./helpers/ERC20Demo');
var ERC20DemoCallBackToken = artifacts.require('./helpers/ERC20DemoCallBack');

module.exports = function (deployer) {
    deployer.deploy(SafeMath);
    deployer.deploy(MovementToken, 15, 0);

    //for test contracts
    deployer.deploy(ERC20DemoToken, "0x101104b24Ba6CFE2105acdae4479f7887e0A48B3");
    deployer.deploy(ERC20DemoCallBackToken, "0x7A35561e25D088577f0c31d3a233F407c3D43AB4");
};
