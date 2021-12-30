import timlockbuild from "contracts/HodleBank.json";
import { selectedAccount } from "../../src/components/Web3Client";
import Web3 from "web3";
import { useEffect, useState } from "react";
import "./Withdraw.css";
let provider = window.ethereum;
const web3 = new Web3(provider);
const timeAbi = timlockbuild.abi;
let networkId;
let hodleBankAddress;
let timlockcontract;
const start = async () => {
  networkId = await web3.eth.net.getId();
  hodleBankAddress = timlockbuild.networks[networkId].address;
  timlockcontract = new web3.eth.Contract(timeAbi, hodleBankAddress);
};
start();

export default function Withdraw() {
  const [vault2, setVault2] = useState("");
  const [vaultNum, setVaultNum] = useState("");

  useEffect(() => {
    setVaultNum(vault2);
  }, [vault2]);

  const withdrawCoinHandler = (e) => {
    e.preventDefault();
    withdraw(vaultNum).then((tx) => {
      console.log(tx);
    });
  };

  const EwithdrawCoinHandler = (e) => {
    e.preventDefault();
    emergencywithdrawal(vaultNum).then((tx) => {
      console.log(tx);
    });
  };
  const EwithdrawTokenHandler = (e) => {
    e.preventDefault();
    EwithdrawToken(vaultNum).then((tx) => {
      console.log(tx);
    });
  };
  const withdrawTokenHandler = (e) => {
    e.preventDefault();
    withdrawToken(vaultNum).then((tx) => {
      console.log(tx);
    });
  };
  return (
    <div className="withdraw">
      <form>
        <label>
          <span>Vault Number</span>
          <input
            type="number"
            onChange={(e) => {
              setVault2(e.target.value);
            }}
          />
        </label>
        <button onClick={withdrawCoinHandler}>Withdraw Coin</button>
        <button onClick={EwithdrawCoinHandler}>Emergency Withdrawal</button>
      </form>
      <form>
        <label>
          <span>Vault Number</span>
          <input
            type="number"
            onChange={(e) => {
              setVault2(e.target.value);
            }}
          />
        </label>
        <button onClick={withdrawTokenHandler}>Withdraw Token</button>
        <button onClick={EwithdrawTokenHandler}>Emergency Withdrawal</button>
      </form>
    </div>
  );
}

const withdraw = (vaultNum) => {
  return timlockcontract.methods.withdrawCoin(vaultNum).send({ from: selectedAccount })
};

const emergencywithdrawal = (vaultNum) => {
  return timlockcontract.methods.emergencyCoinWithdrawal(vaultNum).send({ from: selectedAccount })
};

const withdrawToken = (vaultNum) => {
  return timlockcontract.methods.withdraw(vaultNum).send({ from: selectedAccount })
};

const EwithdrawToken = (vaultNum) => {
  return timlockcontract.methods.emergencyTokenWithdrawal(vaultNum).send({ from: selectedAccount })
};