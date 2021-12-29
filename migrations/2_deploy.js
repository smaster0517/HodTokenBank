const timeLock = artifacts.require("../build/contracts/TimeLock");
const dAI = artifacts.require("../build/contracts/ERC20DAI");
const EdAI = artifacts.require("../build/contracts/DAI");

module.exports = async function (deployer) {
  //deploy Token
  await deployer.deploy(timeLock);
  //assign token into variable to get it's address
  const timelock = await timeLock.deployed();
  //deploy Token
  await deployer.deploy(dAI);
  //assign token into variable to get it's address
  const dai = await dAI.deployed();
  //deploy Token
  await deployer.deploy(EdAI);
  //assign token into variable to get it's address
  const edai = await EdAI.deployed();
};
