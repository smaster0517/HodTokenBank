import timlockbuild from "contracts/TimeLock.json";
import {
  selectedAccount,
  timelockAddress,
} from "../../src/components/Web3Client";
import Web3 from "web3";
import { useEffect, useState } from "react";
import "./Deposit.css";
let provider = window.ethereum;
const web3 = new Web3(provider);
const timeAbi = timlockbuild.abi;
const addre = "0x12a701a736610b254e55040C8DaF7e67C7e03A09";
const timeAdd = "0x494201a3B7ec009bcD711Be890C2bEC76A38841E";
const timlockcontract = new web3.eth.Contract(timeAbi, timeAdd);

export default function Withdraw() {
  const [vault2, setVault2] = useState("");
  const [vaultNum, setVaultNum] = useState("");

  useEffect(() => {
    setVaultNum(vault2);
  }, [vault2]);

  const withdrawHandler = (e) => {
    e.preventDefault();
    withdraw(vaultNum).then((tx) => {
      console.log(tx);
    });
  };
  return (
    <div>
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
        <button onClick={withdrawHandler}>Withdraw</button>
      </form>
    </div>
  );
}

const withdraw = (vaultNum) => {
  return timlockcontract.methods.withdrawCoin(vaultNum).send({
    from: selectedAccount,
  });
};
