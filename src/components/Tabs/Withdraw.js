import { useState } from "react";
import { init, dBankContract, selectedAccount } from "../Web3Client";

let isInitiallized = false;
//let timelock = 60;

export default function Withdaw() {
  const [amount, setAmount] = useState("");
  const withdrawHandler = () => {
    withdrawToken(amount)
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
          <span>Amount</span>
          <input
            type="number"
            onChange={(e) => {
              setAmount(e.target.value);
            }}
          />
        </label>
      </form>
      (<button onClick={withdrawHandler}>Withdraw</button>)
    </div>
  );
}
export const withdrawToken = async (amount) => {
  if (!isInitiallized) {
    await init();
  }

  return dBankContract.methods.withdraw(amount).send({
    from: selectedAccount,
  });
};
