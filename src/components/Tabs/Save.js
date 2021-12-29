import { useEffect, useState } from "react";
import { init, selectedAccount, dBankContract } from "../Web3Client";
import Web3 from "web3";

let isInitiallized = false;
//let timelock = 60;

export default function Save() {
  const [isDeposited, setIsDeposited] = useState(false);
  const [amount, setAmount] = useState(0);
  const [amountEth, setAmountEth] = useState(0);

  const amountHandler = (e) => {
    e.preventDefault();
    SaveNow(amountEth)
      .then((tx) => {
        console.log(tx);
        setIsDeposited(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  useEffect(() => {
    setAmountEth(Web3.utils.toWei(`${amount}`, "ether"));
  }, [amount]);

  return (
    <div>
      <p>{isDeposited}</p>
      <form>
        <label>
          <span>Amount</span>
          <input
            type="number"
            min="0.1"
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </form>
      <button onClick={amountHandler}>save now</button>
    </div>
  );
}
export const SaveNow = async (amount) => {
  if (!isInitiallized) {
    await init();
  }

  return dBankContract.methods.SaveNow().send({
    from: selectedAccount,
    value: amount,
  });
};
