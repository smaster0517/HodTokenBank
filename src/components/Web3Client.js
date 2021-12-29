import Web3 from "web3";
import timelockbuild from "contracts/TimeLock.json";
//let isInitiallized = false;
let selectedAccount;
let networkID;
let contractAddress;
let contractABI;
let web3;
let abi;
let token;
let timelockAddress;

export const init = async () => {
  let provider = window.ethereum;
  if (typeof provider !== "undefined") {
    //metamask is installed

    provider
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        selectedAccount = accounts[0];
        console.log(`selected account is: ${accounts}`);
      })
      .catch((err) => {
        console.log(err.message);
        return;
      });
    provider.on("accountsChanged", function (accounts) {
      selectedAccount = accounts[0];
      console.log(`SelectedAccount changed to ${accounts}`);
    });
  } else {
    console.log("connect metamask");
  }

  const web3 = new Web3(provider);

  const networkID = await web3.eth.net.getId();

  timelockAddress = timelockbuild.networks[networkID].address;
};
export {
  selectedAccount,
  networkID,
  contractAddress,
  contractABI,
  web3,
  abi,
  token,
  timelockAddress,
};
