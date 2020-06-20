const assertJump = require('./helpers/assertJump');
var contractHelper = require('./helpers/contractHelper.js');
var MovementToken = artifacts.require("./MovementToken.sol");
var BigNumber = require('decimal.js');
BigNumber.config({
    precision: 100,
    rounding: 4,
    toExpNeg: 0,
    toExpPos: 40
});

contract('Total supply tests', function (accounts) {

    beforeEach(function(done) {
        this.timeout(3000); // A very long environment setup.
        setTimeout(done, 2500);
    });

    var totalSupplyInsMVT = BigNumber('3300000000000000');
    var blocksPerRound = 15;
    var startingRoundNumber = BigNumber(0);

    it("12.1 " + "Total Supply checking (buy with ETH)", function () {
        var contractInstance;
        var contractOwnerAddress;
        var contractAddress;
        var contributorAddress1 = accounts[6];
        var contributorAddress2 = accounts[5];
        var contributorAddress3 = accounts[4];
        var contributorAddress4 = accounts[3];
        var contributorAddress6 = accounts[7];
        var contributorAddress1DepositAmount = web3.toWei(1.8005, "ether");
        var contributorAddress2DepositAmount = web3.toWei(0.1009088, "ether");
        var contributorAddress3DepositAmount = web3.toWei(0.700090003, "ether");
        var contributorAddress4DepositAmount = web3.toWei(5.774514677778155483, "ether");
        var contractOwnerMVT = BigNumber('0');

        return MovementToken.new(blocksPerRound, startingRoundNumber)
            .then(function (instance) {
                contractInstance = instance;
                contractOwnerAddress = accounts[0];
                contractAddress = instance.address;
                assert.equal(BigNumber(web3.eth.getBalance(contractAddress).toString()).toFixed(0), 0, "Contract ETH Balance is wrong");

                return Promise.all([
                    contractInstance.totalSupply(),
                    contractInstance.balanceOf.call(contractOwnerAddress) //contract owner MVT balance
                ])
            }).then(function(values) {
                assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should be " + totalSupplyInsMVT.toFixed(0));
                assert.equal(values[1].toFixed(0), 0, "contract owner MVT balance should be " + 0);
                return contractHelper.mineNextBlock(7*60);
            }).then(function(tx) {
                assert.isOk(tx, "should be transaction");
                return contractInstance.sendTransaction({value: contributorAddress1DepositAmount, from: contributorAddress1});
            }).then(function(tx) {
                return Promise.all([
                    contractInstance.totalSupply(),
                    contractInstance.balanceOf.call(contractOwnerAddress),   //contract owner MVT balance
                    contractInstance.balanceOf.call(contributorAddress1)
                ])
            }).then(function(values) {
                assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should be " + totalSupplyInsMVT.toFixed(0));
                assert.equal(values[1].toFixed(0), 0, "Contract owner MVT balance should be " + 0);
                assert.equal(values[2].toFixed(0), 0, "Contract contributorAddress1 Balance is wrong");

                return contractInstance.sendTransaction({value: contributorAddress2DepositAmount, from: contributorAddress2});
            }).then(function(tx) {
                return Promise.all([
                    contractInstance.totalSupply(),
                    contractInstance.balanceOf.call(contractOwnerAddress),   //contract owner MVT balance
                    contractInstance.balanceOf.call(contributorAddress2)
                ])
            }).then(function(values) {
                assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should be " + totalSupplyInsMVT.toFixed(0));
                assert.equal(values[1].toFixed(0), 0, "contract owner MVT balance should be " + 0);
                assert.equal(values[2].toFixed(0), 0, "Contract contributorAddress2 Balance is wrong");

                return Promise.all([
                    contractInstance.transfer(contributorAddress6, 50000000, {from: contributorAddress2})
                ])
            })
            .catch(function(tx) {
                assertJump(tx);

                return Promise.all([
                    contractInstance.totalSupply(),
                    contractInstance.balanceOf.call(contractOwnerAddress),   //contract owner MVT balance
                    contractInstance.balanceOf.call(contributorAddress2),
                    contractInstance.balanceOf.call(contributorAddress6)
                ])
            })
            .then(function(values) {
                assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should be " + totalSupplyInsMVT.toFixed(0));
                assert.equal(values[1].toFixed(0), 0, "contract owner MVT balance should be " + 0);
                assert.equal(values[2].toFixed(0), 0, "Contract contributorAddress2 Balance is wrong");
                assert.equal(values[3].toFixed(0), 0, "Contract contributorAddress6 Balance is wrong");

                return contractHelper.mineNextBlock(18*60);
            }).then(function(tx) {
                assert.isOk(tx, "should be transaction");
                return contractInstance.sendTransaction({value: contributorAddress3DepositAmount, from: contributorAddress3});
            }).then(function(tx) {
                return Promise.all([
                    contractInstance.totalSupply(),
                    contractInstance.balanceOf(contractOwnerAddress),   //contract owner MVT balance
                    contractInstance.balanceOf.call(contributorAddress2),
                    contractInstance.balanceOf.call(contributorAddress3),
                    contractInstance.balanceOf.call(contributorAddress6)
                ])
            }).then(function(values) {
                assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should same");
                assert.equal(values[1].toFixed(0), 0, "contract owner balance is wrong");
                assert.equal(values[2].toFixed(0), 0, "Contract contributorAddress2 Balance is wrong");
                assert.equal(values[3].toFixed(0), 0, "Contract contributorAddress3 Balance is wrong");
                assert.equal(values[4].toFixed(0), 0, "Contract contributorAddress6 Balance is wrong");

                return contractInstance.sendTransaction({value: contributorAddress4DepositAmount, from: contributorAddress4});
            }).then(function(tx) {
                return Promise.all([
                    contractInstance.totalSupply(),
                    contractInstance.balanceOf(contractOwnerAddress),   //contract owner MVT balance
                    contractInstance.balanceOf.call(contributorAddress3),
                    contractInstance.balanceOf.call(contributorAddress4)
                ])
            }).then(function(values) {
                assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should same");
                assert.equal(values[1].toFixed(0), 0, "contract owner balance is wrong");
                assert.equal(values[2].toFixed(0), 0, "Contract contributorAddress3 Balance is wrong");
                assert.equal(values[3].toFixed(0), 0, "Contract contributorAddress4 Balance is wrong");

                return contractHelper.mineNextBlock(15*60);
            }).then(function(tx) {
                assert.isOk(tx, "should be transaction");
                return Promise.all([
                    contractInstance.totalSupply(),
                    contractInstance.balanceOf(contractOwnerAddress),   //contract owner MVT balance
                    contractInstance.balanceOf.call(contributorAddress3),
                    contractInstance.balanceOf.call(contributorAddress4)
                ])
            }).then(function(values) {
                assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should same");
                assert.equal(values[1].toFixed(0), contractOwnerMVT.toFixed(0), "contract owner balance is wrong");
                assert.equal(values[2].toFixed(0), 0, "Contract contributorAddress3 Balance is wrong");
                assert.equal(values[3].toFixed(0), 0, "Contract contributorAddress4 Balance is wrong");
            })

    });

   it("12.2 " + "Total Supply checking (issueTokens method)", function () {
	   var contractInstance;
	   var contractOwnerAddress;
	   var contractAddress;
	   var contributorAddress1 = accounts[6];
	   var contributorAddress2 = accounts[5];
	   var contributorAddress3 = accounts[4];
	   var contributorAddress4 = accounts[3];
	   var contributorAddress5 = accounts[2];
	   var contributorAddress6 = accounts[7];
	   var contributorAddress1sMVTAmount = BigNumber('15478545');
	   var contributorAddress2sMVTAmount = BigNumber('1');
	   var contributorAddress3sMVTAmount = BigNumber('156895845826264');
	   var contributorAddress4sMVTAmount = BigNumber('91258465416894658');
	   var contributorAddress5sMVTAmount =  BigNumber('485154815266481515');
	   var issuedMVTAmount = BigNumber('0');
       var contractOwnerMVT = BigNumber('0');

	   return MovementToken.new(blocksPerRound, startingRoundNumber)
		   .then(function (instance) {
			   contractInstance = instance;
			   contractOwnerAddress = accounts[0];
			   contractAddress = instance.address;
			   assert.equal(BigNumber(web3.eth.getBalance(contractAddress).toString()).toFixed(0), 0, "Contract ETH Balance is wrong");
			   return Promise.all([
				   contractInstance.totalSupply(),
				   contractInstance.balanceOf.call(contractOwnerAddress) //contract owner MVT balance
			   ])
		   }).then(function(values) {
			   assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0),"totalSupply should be " + totalSupplyInsMVT.toFixed(0));
			   assert.equal(values[1].toFixed(0), 0, "contract owner MVT balance should be " + 0);
			   return contractHelper.mineNextBlock(8*60);
		   }).then(function(tx) {
			   assert.isOk(tx, "should be transaction");
			   return Promise.all([
				   contractInstance.issueTokens(contributorAddress1, contributorAddress1sMVTAmount.toFixed(0), {from: contractOwnerAddress}),
				   contractInstance.issueTokens(contributorAddress2, contributorAddress2sMVTAmount.toFixed(0), {from: contractOwnerAddress}),
				   contractInstance.issueTokens(contributorAddress3, contributorAddress3sMVTAmount.toFixed(0), {from: contractOwnerAddress}),
				   contractInstance.issueTokens(contributorAddress4, contributorAddress4sMVTAmount.toFixed(0), {from: contractOwnerAddress})
			   ])
		   }).then(function(tx) {
			   assert.isOk(tx, "should be transaction");
               issuedMVTAmount = issuedMVTAmount
                   .add(contributorAddress1sMVTAmount)
                   .add(contributorAddress2sMVTAmount)
                   .add(contributorAddress3sMVTAmount)
                   .add(contributorAddress4sMVTAmount);
			   return Promise.all([
				   contractInstance.totalSupply(),
				   contractInstance.balanceOf.call(contractOwnerAddress),   //contract owner MVT balance
				   contractInstance.balanceOf.call(contributorAddress1),
				   contractInstance.balanceOf.call(contributorAddress2),
				   contractInstance.balanceOf.call(contributorAddress3),
				   contractInstance.balanceOf.call(contributorAddress4)
			   ])
		   }).then(function(values) {
			   assert.equal(BigNumber(web3.eth.getBalance(contractAddress).toString()).toFixed(0), 0, "Contract ETH Balance is wrong");

			   assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should equal");
			   assert.equal(values[1].toFixed(0), contractOwnerMVT.toFixed(0), "contract owner MVT balance should be " + contractOwnerMVT.toFixed(0));
			   assert.equal(values[2].toFixed(0), contributorAddress1sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[3].toFixed(0), contributorAddress2sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[4].toFixed(0), contributorAddress3sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[5].toFixed(0), contributorAddress4sMVTAmount.toFixed(0), "Contract Balance is wrong");

			   return contractHelper.mineNextBlock(15*60);
		   })
		   .then(function(tx) {
			   assert.isOk(tx, "should be transaction");

			   return contractInstance.issueTokens(contributorAddress5, contributorAddress5sMVTAmount.toFixed(0), {from: contractOwnerAddress})
		   })
		   .then(function(tx) {
			   assert.isOk(tx, "should be transaction");
               issuedMVTAmount = issuedMVTAmount.add(contributorAddress5sMVTAmount);

			   return Promise.all([
				   contractInstance.totalSupply(),
				   contractInstance.balanceOf.call(contractOwnerAddress),   //contract owner MVT balance
				   contractInstance.balanceOf.call(contributorAddress1),
				   contractInstance.balanceOf.call(contributorAddress2),
				   contractInstance.balanceOf.call(contributorAddress3),
				   contractInstance.balanceOf.call(contributorAddress4),
				   contractInstance.balanceOf.call(contributorAddress5)
			   ])
		   }).then(function(values) {
			   assert.equal(BigNumber(web3.eth.getBalance(contractAddress).toString()).toFixed(0), 0, "Contract ETH Balance is wrong");

			   assert.equal(values[0].toFixed(0), totalSupplyInsMVT.toFixed(0), "totalSupply should equal");
			   assert.equal(values[1].toFixed(0), contractOwnerMVT.toFixed(0), "contract owner MVT balance is wrong");
			   assert.equal(values[2].toFixed(0), contributorAddress1sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[3].toFixed(0), contributorAddress2sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[4].toFixed(0), contributorAddress3sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[5].toFixed(0), contributorAddress4sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[6].toFixed(0), contributorAddress5sMVTAmount.toFixed(0), "Contract Balance is wrong");

			   var moreWhenHave = totalSupplyInsMVT.plus(BigNumber('1'));
			   return contractInstance.issueTokens(contributorAddress6, moreWhenHave.toFixed(0), {from: contractOwnerAddress})
		   }).catch(function(tx) {
			   assertJump(tx);
			   assert.equal(BigNumber(web3.eth.getBalance(contractAddress).toString()).toFixed(0), 0, "Contract ETH Balance is wrong");

			   return Promise.all([
				   contractInstance.balanceOf.call(contractOwnerAddress),   //contract owner MVT balance
				   contractInstance.balanceOf.call(contributorAddress1),
				   contractInstance.balanceOf.call(contributorAddress2),
				   contractInstance.balanceOf.call(contributorAddress3),
				   contractInstance.balanceOf.call(contributorAddress4),
				   contractInstance.balanceOf.call(contributorAddress5)
			   ])
		   })
		   .then(function(values) {
			   assert.equal(BigNumber(web3.eth.getBalance(contractAddress).toString()).toFixed(0), 0, "Contract ETH Balance is wrong");
			   assert.equal(values[0].toFixed(0), contractOwnerMVT.toFixed(0), "contract owner MVT balance is wrong");
			   assert.equal(values[1].toFixed(0), contributorAddress1sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[2].toFixed(0), contributorAddress2sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[3].toFixed(0), contributorAddress3sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[4].toFixed(0), contributorAddress4sMVTAmount.toFixed(0), "Contract Balance is wrong");
			   assert.equal(values[5].toFixed(0), contributorAddress5sMVTAmount.toFixed(0), "Contract Balance is wrong");

               var leftMVTTokens = totalSupplyInsMVT.minus(issuedMVTAmount).toFixed(0);
			   return Promise.all([
				   contractInstance.issueTokens(contributorAddress6, leftMVTTokens, {from: contractOwnerAddress}),
                   Promise.resolve(values[1]),
                   Promise.resolve(values[2]),
                   Promise.resolve(values[3]),
                   Promise.resolve(values[4]),
                   Promise.resolve(values[5])
			   ])
		   })
       .then(function(values) {

           return Promise.all([
               contractInstance.transfer(contributorAddress6, values[1], {from: contributorAddress1}),
               contractInstance.transfer(contributorAddress6, values[2], {from: contributorAddress2}),
               contractInstance.transfer(contributorAddress6, values[3], {from: contributorAddress3}),
               contractInstance.transfer(contributorAddress6, values[4], {from: contributorAddress4}),
               contractInstance.transfer(contributorAddress6, values[5], {from: contributorAddress5})
           ])
       })
        .then(function(values) {

            return Promise.all([
                contractInstance.balanceOf.call(contractOwnerAddress),   //contract owner MVT balance
                contractInstance.balanceOf.call(contributorAddress1),
                contractInstance.balanceOf.call(contributorAddress2),
                contractInstance.balanceOf.call(contributorAddress3),
                contractInstance.balanceOf.call(contributorAddress4),
                contractInstance.balanceOf.call(contributorAddress5),
                contractInstance.balanceOf.call(contributorAddress6)
            ])
        })

        .then(function(values) {
            assert.equal(BigNumber(web3.eth.getBalance(contractAddress).toString()).toFixed(0), 0, "Contract ETH Balance is wrong");

            assert.equal(values[0].toFixed(0), 0, "Contract owner MVT Balance is wrong");
            assert.equal(values[1].toFixed(0), 0, "Contract Balance is wrong");
            assert.equal(values[2].toFixed(0), 0, "Contract Balance is wrong");
            assert.equal(values[3].toFixed(0), 0, "Contract Balance is wrong");
            assert.equal(values[4].toFixed(0), 0, "Contract Balance is wrong");
            assert.equal(values[5].toFixed(0), 0, "Contract Balance is wrong");
            assert.equal(values[6].toFixed(0), totalSupplyInsMVT.toFixed(0), "Contract Balance is wrong");

            return contractInstance.issueTokens(contributorAddress6, 1, {from: contractOwnerAddress})
        }).catch(function(tx) {
            assertJump(tx);
            assert.equal(BigNumber(web3.eth.getBalance(contractAddress).toString()).toFixed(0), 0, "Contract ETH Balance is wrong");
        })
   });

});