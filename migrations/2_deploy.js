const hodlbank = artifacts.require("../build/contracts/HodleBank");
const dAI = artifacts.require("../build/contracts/ERC20DAI");
const EdAI = artifacts.require("../build/contracts/DAI");

module.exports = async function (deployer) {
  //deploy Token
  await deployer.deploy(hodlbank);
  //assign token into variable to get it's address
  const hodlebank = await hodlbank.deployed();
  //deploy Token
  await deployer.deploy(dAI);
  //assign token into variable to get it's address
  const dai = await dAI.deployed();
  //deploy Token
  await deployer.deploy(EdAI);
  //assign token into variable to get it's address
  const edai = await EdAI.deployed();
};
