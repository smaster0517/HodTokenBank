import { useState } from "react";
import { useEffect } from "react";
import { init, selectedAccount, dBankContract } from "../Web3Client";
import Web3 from "web3";

let isInitiallized = false;
//let timelock = 60;

export default function Balance() {
  const [mybalance, setMyBalance] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const getBalance = () => {
    accountBalanceInfo()
      .then((balance) => {
        setMyBalance(Web3.utils.fromWei(balance, "ether").toString());
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getBalance();
    getContractBalance();
  }, []);

  const getContractBalance = () => {
    contractBalanceInfo()
      .then((balance) => {
        setContractBalance(Web3.utils.fromWei(balance, "ether").toString());
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <p>your Account Balance is: {mybalance} YOM</p>(
      <button onClick={() => getBalance()}>Check Balance</button>)
      <p>contract Balance is: {contractBalance} YOM</p>(
      <button onClick={() => getContractBalance()}>Contract Balance</button>)
    </div>
  );
}

export const contractBalanceInfo = async () => {
  if (!isInitiallized) {
    await init();
  }

  return dBankContract.methods.getContractBalance().call();
};

export const accountBalanceInfo = async () => {
  if (!isInitiallized) {
    await init();
  }

  return dBankContract.methods.getBalance(selectedAccount).call();
};
