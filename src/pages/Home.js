import timlockbuild from "contracts/TimeLock.json";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { selectedAccount } from "../../src/components/Web3Client";
let provider = window.ethereum;
const web3 = new Web3(provider);
const timeAbi = timlockbuild.abi;
const timeAdd = "0xB4ef72baDB7a090036C97e18966FCe162f0434f1";
const timlockcontract = new web3.eth.Contract(timeAbi, timeAdd);

export default function Home() {
  const [boxnum, setBoxNum] = useState(null);
  const [beneficiary2, setBeneficiary2] = useState("");
  const [tokenAddress2, setTokenAddress2] = useState("");
  const [tokenBalance2, setTokenBalance2] = useState("");
  const [releaseTime2, setReleaseTime2] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [releaseTime, setReleaseTime] = useState("");
  const [tokenBalance, setTokenBalance] = useState("");
  const [loc, setLoc] = useState(false);

  useEffect(() => {
    setBeneficiary(beneficiary2);
    setTokenAddress(tokenAddress2);
    setReleaseTime(releaseTime2);
    setTokenBalance(tokenBalance2);
  }, [beneficiary2, tokenBalance2, tokenAddress2, releaseTime2]);
  const lockbox = (e) => {
    e.preventDefault();
    if (!+boxnum == null || !+boxnum == "") {
      lockBoxStructs(boxnum).then((tx) => {
        console.log(tx[0]);
        setBeneficiary2(tx[0]);
        setTokenAddress2(tx[1]);
        setTokenBalance2(tx[2]);
        setReleaseTime2(tx[3]);
        setLoc(true);
        console.log(tx);
      });
    } else {
      console.log("error");
    }
  };

  const boxlength = (e) => {
    e.preventDefault();
    lockBoxlength();
  };
  return (
    <>
      <>
        {loc && (
          <div>
            <div>
              <h2>Beneficiary: </h2>
              <p>{beneficiary}</p>
            </div>
            <div>
              <h2>Balance: </h2>
              <p>{tokenBalance}</p>
            </div>
            <div>
              {" "}
              <h2> tokenAddress: </h2>
              <p>{tokenAddress}</p>
            </div>
            <div>
              <h2>ReleaseTime:</h2> <p>{releaseTime}</p>
            </div>
          </div>
        )}
      </>
      <>
        <div>
          <form>
            <label>
              <span> getLocker Content</span>
              <input
                type="text"
                onChange={(e) => {
                  setBoxNum(e.target.value);
                }}
              />
            </label>
            <button onClick={lockbox}>UnLockBox</button>
            <button onClick={boxlength}>Boxlength</button>
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

const lockBoxlength = async () => {
  return await timlockcontract.methods
    .getStructBoxLenght()
    .call()
    .then((tx) => {
      alert(`your Lock ID is, ${tx}`);
    });
};
