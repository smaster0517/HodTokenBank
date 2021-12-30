import timlockbuild from "contracts/HodleBank.json";
import Web3 from "web3";
import { useState } from "react";
import { selectedAccount } from "../components/Web3Client";
import "./Deposit.css";
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

export default function UpdateCT({ vaultNum }) {
    const [amount, setAmount] = useState("");
    const [duration, setDuration] = useState("");
    const [update, setUpdate] = useState(false);

    const updatetCoinHandler = (e) => {
        e.preventDefault();
        updateCoin(amount, duration, vaultNum)
            .then((tx) => {
                console.log(tx);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="update">
            {!update && <button onClick={() => setUpdate(true)}>update</button>}
            <>
                {update && <form>
                    <label>
                        <span> Amount</span>
                        <input
                            type="number"
                            onChange={(e) => {
                                setAmount(e.target.value);
                            }}
                        />
                    </label>
                    <label>
                        <span> New Release Date</span>
                        <input
                            type='date'
                            onChange={(e) => {
                                setDuration(parseInt((new Date(e.target.value).getTime() / 1000).toFixed(0)));
                            }}
                        />
                    </label>
                    <label>
                        <span>Vault Number</span>
                        <input
                            type="number"
                            value={vaultNum}
                            readOnly
                        />
                    </label>
                    {<button onClick={updatetCoinHandler}>update Vault</button>}
                </form>}
            </>
        </div>
    );
}

const updateCoin = async (amount, duration, vaultNum) => {
    return await timlockcontract.methods
        .UpdateLocktCoin(
            vaultNum,
            web3.utils.toWei(
                amount.toLocaleString("fullwide", { useGrouping: false })
            ),
            duration
        )
        .send({
            from: selectedAccount,
            value: web3.utils.toWei(
                amount.toLocaleString("fullwide", { useGrouping: false })
            ),
        });
};
