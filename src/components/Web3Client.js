import Web3 from "web3";
let selectedAccount;

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



};
export { selectedAccount };
