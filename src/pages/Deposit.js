import ierc20build from "contracts/IERC20.json";
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
const iercAbi = ierc20build.abi;
const timeAbi = timlockbuild.abi;
const addre = "0x12a701a736610b254e55040C8DaF7e67C7e03A09";
const timlockcontract = new web3.eth.Contract(timeAbi, timelockAddress);

export default function Deposit() {
  const [coinAmount2, setCoinAmount2] = useState("");
  const [coinDuration2, setCoinDuration2] = useState("");
  const [coinSymbol2, setCoinSymbol2] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [coinDuration, setCoinDuration] = useState("");
  const [coinSymbol, setCoinSymbol] = useState("");
  const [amount2, setAmount2] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [tokenAddres, setTokenAddress] = useState(addre);
  const [tokencontract, setTokenContract] = useState("");
  const [approve, setApprove] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    setTokenContract(new web3.eth.Contract(iercAbi, tokenAddres));
    setAmount(amount2);
    setApprove(approved);
    setCoinAmount(coinAmount2);
    setCoinDuration(coinDuration2);
    setCoinSymbol(coinSymbol2);
  }, [tokenAddres, amount2, approved, coinSymbol2, coinAmount2, coinDuration2]);

  const depositCoinHandler = (e) => {
    e.preventDefault();
    depositCoin(+coinAmount, +coinDuration, coinSymbol)
      .then((tx) => {
        console.log(tx);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const depositHandler = (e) => {
    e.preventDefault();
    deposit(tokenAddres, +amount, +duration)
      .then((tx) => {
        console.log(tx);
        setApproved(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const approvalHandler = (e) => {
    e.preventDefault();
    console.log(tokencontract, amount, duration, tokenAddres);
    approval(tokencontract, amount)
      .then((tx) => {
        console.log(tx);
        if (tx.events.Approval.type === "mined") {
          console.log(tx.events.Approval.type);
          setApproved(true);
          console.log(approved);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div className="deposit">
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
        <div>
          {!approve && (
            <button onClick={approvalHandler}>Approve Amount To Deposit</button>
          )}
        </div>
        {approve && <button onClick={depositHandler}>deposite</button>}
      </form>
      <form>
        <label>
          <span> Amount</span>
          <input
            type="text"
            onChange={(e) => {
              setCoinAmount2(e.target.value);
            }}
          />
        </label>
        <label>
          <span> Duration (sec)</span>
          <input
            type="number"
            onChange={(e) => {
              setCoinDuration2(e.target.value);
            }}
          />
        </label>
        <label>
          <span> Coin Symbol</span>
          <input
            type="text"
            onChange={(e) => {
              setCoinSymbol2(e.target.value);
            }}
          />
        </label>
        {<button onClick={depositCoinHandler}>deposite</button>}
      </form>
    </div>
  );
}

const deposit = async (tokenAddres, amount, duration) => {
  const dep = await timlockcontract.methods
    .deposit(
      tokenAddres,
      web3.utils.toWei(
        amount.toLocaleString("fullwide", { useGrouping: false })
      ),
      duration
    )
    .send({ from: selectedAccount });
  console.log(amount, duration);
  lockBoxlength();
  return dep;
};

const approval = async (tokencontract, amount) => {
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

const lockBoxlength = async () => {
  return await timlockcontract.methods
    .getStructBoxLenght()
    .call()
    .then((tx) => {
      alert(`your Lock ID is, ${tx - 1}`);
    });
};

const depositCoin = async (amount, duration, symbol) => {
  const dep = await timlockcontract.methods
    .depositCoin(
      web3.utils.toWei(
        amount.toLocaleString("fullwide", { useGrouping: false })
      ),
      duration,
      symbol
    )
    .send({
      from: selectedAccount,
      value: web3.utils.toWei(
        amount.toLocaleString("fullwide", { useGrouping: false })
      ),
    });
  console.log(amount, duration, symbol);
  //lockBoxlength();
  return dep;
};
