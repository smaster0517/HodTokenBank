import { init, selectedAccount, dBankContract } from "../Web3Client";

let isInitiallized = false;
//let timelock = 60;

export default function EmmergencyWithdraw() {
  const Quit = () => {
    withdrawToken()
      .then((tx) => {
        console.log(tx);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div>
      (<button onClick={Quit}>Withdraw</button>)
    </div>
  );
}
export const withdrawToken = async () => {
  if (!isInitiallized) {
    await init();
  }

  return dBankContract.methods.emergencyWithdraw().send({
    from: selectedAccount,
  });
};
