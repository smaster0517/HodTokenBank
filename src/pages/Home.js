import timlockbuild from "contracts/HodleBank.json";
import Web3 from "web3";
import { useEffect, useState } from "react";
import './Home.css'
import UpdateCT from "./UpdateCT";
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

export default function Home() {
  const [boxnum, setBoxNum] = useState('');
  const [beneficiary, setBeneficiary] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [releaseTime, setReleaseTime] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [status, setStatus] = useState('');
  const [boxnum2, setBoxNum2] = useState('');
  const [beneficiaryCoin, setBeneficiaryCoin] = useState("");
  const [coinSymbol, setCoinSymbol] = useState("");
  const [releaseTimeCoin, setReleaseTimeCoin] = useState("");
  const [coinBalance, setCoinBalance] = useState("");
  const [statusCoin, setStatusCoin] = useState('');
  const [loc, setLoc] = useState(false);
  const [loc2, setLoc2] = useState(false);


  const lockCoin = (e) => {
    e.preventDefault();
    try {
      if (!boxnum2 == "") {
        lockBoxCoin(boxnum2).then((tx) => {
          setBeneficiaryCoin(tx['beneficiary']);
          setCoinSymbol(tx['coinName']);
          setCoinBalance(tx["balance"]);
          let a = new Date((tx['releaseTime']) * 1000);
          let date = a.getDate()
          let month = a.getMonth() + 1
          let year = a.getFullYear()
          let hour = a.getHours()
          let min = a.getMinutes()
          let time = date + '-' + month + '-' + year + ':' + hour + ':' + min
          setReleaseTimeCoin(time)
          tx.status ? setStatusCoin('Active') : setStatusCoin('Not Active')
          console.log(tx)
          setLoc2(true);
        });
      } else {
        console.log("error");
      }

    } catch (error) {
      console.log(error)
    }

  };



  const lockbox = (e) => {
    e.preventDefault();
    try {
      if (!boxnum == "") {
        lockBoxStructs(boxnum).then((tx) => {
          setBeneficiary(tx['beneficiary']);
          setTokenAddress(tx['token']);
          setTokenBalance(tx["balance"]);
          let a = new Date((tx['releaseTime']) * 1000);
          let date = a.getDate()
          let month = a.getMonth() + 1
          let year = a.getFullYear()
          let hour = a.getHours()
          let min = a.getMinutes()
          let time = date + '-' + month + '-' + year + ':' + hour + ':' + min
          setReleaseTime(time)
          tx.status ? setStatus('Active') : setStatus('Not Active')

          setLoc(true);
          console.log(tx);
        });
      } else {
        console.log("error");
      }

    } catch (error) {
      console.log(error)
    }

  };


  return (
    <>

      <>
        {loc2 && (
          <div className='home'>
            <div className='content'>
              <h3>Beneficiary: </h3>
              <p>{beneficiaryCoin}</p>
            </div>
            <div className='content'>
              <h3>Balance: </h3>
              <p>{coinBalance}</p>
            </div>
            <div className='content'>
              <h3> Symbol: </h3>
              <p>{coinSymbol}</p>
            </div>
            <div className='content'>
              <h3>ReleaseTime:</h3> <p>{releaseTimeCoin}</p>
            </div>
            <div className='content'>
              <h3>Status:</h3> <p>{statusCoin}</p>
            </div>
            <UpdateCT vaultNum={boxnum2} />
          </div>
        )}
      </>
      <>
        {loc && (
          <div className='home'>
            <div className='content'>
              <h3>Beneficiary: </h3>
              <p>{beneficiary}</p>
            </div>
            <div className='content'>
              <h3>Balance: </h3>
              <p>{tokenBalance}</p>
            </div>
            <div className='content'>
              <h3> tokenAddress: </h3>
              <p>{tokenAddress}</p>
            </div>
            <div className='content'>
              <h3>ReleaseTime:</h3> <p>{releaseTime}</p>
            </div>
            <div className='content'>
              <h3>Status:</h3> <p>{status}</p>
            </div>
            <UpdateCT />
          </div>
        )}
      </>
      <>
        <div>
          <form>
            <label>
              <input
                type="text"
                onChange={(e) => {
                  setBoxNum(e.target.value);
                }}
              />
            </label>
            <button onClick={lockbox} >UnLockTokenBox</button>

          </form>
          <form>
            <label>
              <input
                type="text"
                onChange={(e) => {
                  setBoxNum2(e.target.value);
                }}
              />
            </label>
            <button onClick={lockCoin}>UnLockCoinBox</button>
          </form>
        </div>
      </>
    </>
  );
}

const lockBoxStructs = (boxnum) => {
  const tim = timlockcontract.methods.lockBoxStructs(boxnum).call();

  return tim;
};

const lockBoxCoin = (boxnum) => {
  const tim = timlockcontract.methods.lockCoins(boxnum).call();

  return tim;
};

