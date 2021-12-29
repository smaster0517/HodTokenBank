import ierc20build from "contracts/IERC20.json";
import timlockbuild from "contracts/TimeLock.json";

import { init, selectedAccount, timelockAddress } from "../Web3Client";
import Web3 from "web3";
import { useEffect, useState } from "react";
let provider = window.ethereum;
const web3 = new Web3(provider);

const iercAbi = ierc20build.abi;
const timeAbi = timlockbuild.abi;
const addre = "0xbE3d94805B379e57C3C30ceB6f3212B661216e9C";
const timeAdd = "0xe41EEcAd5CC500E29f2CB3690c2789EBC24D8D18";
const timlockcontract = new web3.eth.Contract(timeAbi, timeAdd);

//const tokencontract = new web3.eth.Contract(iercAbi, addre);
//const amount = 200;

let isInitiallized = false;
export default function TokenDeposit() {
  const [amount2, setAmount2] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [tokenAddres, setTokenAddress] = useState(addre);
  const [tokencontract, setTokenContract] = useState("");

  useEffect(() => {
    setTokenContract(new web3.eth.Contract(iercAbi, tokenAddres));
    setAmount(amount2);
  }, [tokenAddres, amount2]);
  //setTokenContract(new web3.eth.Contract(iercAbi, tokenAddres));
  const getApproval = (e) => {
    e.preventDefault();
    console.log(tokencontract, amount, duration, tokenAddres);
    approval(tokencontract, amount)
      .then((tx) => {
        console.log(tx);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const lockbox = () => {
    lockBoxStructs().then((tx) => {
      console.log(tx);
    });
  };

  const depositHandler = () => {
    deposit(tokenAddres, +amount, +duration)
      .then((tx) => {
        console.log(tx);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div>
      <form>
        <label>
          <span> Token Address</span>
          <input
            type="text"
            onChange={(e) => {
              setTokenAddress(e.target.value);
            }}
          />
        </label>
        <label>
          <span> Amount</span>
          <input
            type="text"
            onChange={(e) => {
              setAmount2(e.target.value);
            }}
          />
        </label>
        <label>
          <span> Duration (sec)</span>
          <input
            type="number"
            onChange={(e) => {
              setDuration(e.target.value);
            }}
          />
        </label>
      </form>
      <div>
        <button onClick={getApproval}>Approve</button>
        <button onClick={depositHandler}>deposite</button>
        <button onClick={lockbox}>LockBox</button>
      </div>
    </div>
  );
}

export const approval = async (tokencontract, amount) => {
  if (!isInitiallized) {
    await init();
  }

  return tokencontract.methods
    .approve(
      timelockAddress,
      web3.utils.toWei(
        amount.toLocaleString("fullwide", { useGrouping: false })
      )
    )
    .send({ from: selectedAccount })

    .catch((err) => {
      console.log(err.message);
    });
};

const deposit = (tokenAddres, amount, duration) => {
  const dep = timlockcontract.methods
    .deposit(
      tokenAddres,
      web3.utils.toWei(
        amount.toLocaleString("fullwide", { useGrouping: false })
      ),
      duration
    )
    .send({ from: selectedAccount });
  console.log(amount, duration);
  return dep;
};

const lockBoxStructs = () => {
  const tim = timlockcontract.methods.lockBoxStructs(11).call();

  return tim;
};
