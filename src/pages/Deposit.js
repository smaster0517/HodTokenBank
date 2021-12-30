import ierc20build from "contracts/IERC20.json";
import timlockbuild from "contracts/HodleBank.json";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { selectedAccount } from "../components/Web3Client";
import "./Deposit.css";

import UpdateCT from "./UpdateCT";
let provider = window.ethereum;
const web3 = new Web3(provider);
const iercAbi = ierc20build.abi;
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

export default function Deposit() {
  const [coinAmount, setCoinAmount] = useState("");
  const [coinDuration, setCoinDuration] = useState("");
  const [coinSymbol, setCoinSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokencontract, setTokenContract] = useState("");
  const [approve, setApprove] = useState(false);

  useEffect(() => {
    setTokenContract(new web3.eth.Contract(iercAbi, tokenAddress));
  }, [tokenAddress]);

  const depositCoinHandler = (e) => {
    e.preventDefault();
    try {
      if (+coinAmount == 0 || +coinDuration == 0) {
        throw new Error("amount and Duration must not be empty");
      }
      depositCoin(+coinAmount, coinDuration, coinSymbol)
        .then((tx) => {
          console.log(tx);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const depositTokenHandler = (e) => {
    e.preventDefault();

    deposit(tokenAddress, +amount, +duration)
      .then((tx) => {
        console.log(tx);
        setApprove((prev) => (prev = false));
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const approvalHandler = (e) => {
    e.preventDefault();
    try {
      if (+amount == 0) {
        throw new Error("Token value must be greater than zero");
      }
      if (duration === 0 || duration == "") {
        throw new Error("Duration value must be greater than zero");
      }
      if (tokenAddress.length < 42) {
        throw new Error("Enter correct address");
      }

      approval(tokencontract, amount)
        .then((tx) => {
          console.log(tx);
          if (tx.events.Approval.type === "mined") {
            console.log(tx.events.Approval.type);
            setApprove((prev) => (prev = true));
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="deposit">
      <form>
        <label>
          <span> Token Address</span>
          <input
            type="text"
            onChange={(e) => {
              setTokenAddress(
                (prevTokenAddress) => (prevTokenAddress = e.target.value)
              );
            }}
            value={tokenAddress}
          />
        </label>
        <label>
          <span> Amount</span>
          <input
            type="text"
            onChange={(e) => {
              setAmount((prevAmount) => (prevAmount = e.target.value));
            }}
            value={amount}
          />
        </label>
        <label>
          <span> Release Date</span>
          <input
            type="date"
            onChange={(e) => {
              setDuration(parseInt((new Date(e.target.value).getTime() / 1000).toFixed(0)));
            }}

          />
        </label>
        <div>
          {!approve && (
            <button onClick={approvalHandler}>Approve Amount To Deposit</button>
          )}
        </div>
        {approve && <button onClick={depositTokenHandler}>deposite</button>}
      </form>
      <form>
        <label>
          <span> Coin Symbol</span>
          <input
            type="text"
            onChange={(e) => {
              setCoinSymbol((prevSymbol) => (prevSymbol = e.target.value));
            }}
          />
        </label>
        <label>
          <span> Amount</span>
          <input
            type="text"
            onChange={(e) => {
              setCoinAmount((prevAmount) => (prevAmount = e.target.value));
            }}
          />
        </label>
        <label>
          <span> Release Date</span>
          <input
            type="date"
            onChange={(e) => {
              setCoinDuration(parseInt((new Date(e.target.value).getTime() / 1000).toFixed(0)))
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
      hodleBankAddress,
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
