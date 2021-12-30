import timlockbuild from "contracts/HodleBank.json";
import { useState } from "react";
import Web3 from "web3";
import { selectedAccount } from "../../components/Web3Client";
import './OwnerUpdate.css'
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
    console.log(timlockcontract)
};
start();

export default function OwnerUpdate() {
    const [fee, setFee] = useState('')
    const [tax, setTax] = useState('')
    const [address, setAddress] = useState('')
    const vaultlength = (e) => {
        e.preventDefault();
        lockCoinlength();
    };

    const boxlength = (e) => {
        e.preventDefault();
        lockBoxlength();
    };

    const setFeeHandler = (e) => {
        e.preventDefault();
        setFees(+fee).then((tx) => {
            //alert(`New fee is: ${+tx}`);
            console.log(tx)
        });
    };
    const checkFeeHandler = (e) => {
        e.preventDefault();
        currentFee()

    };

    const checkTaxHandler = (e) => {
        e.preventDefault();
        currentTax()

    };

    const checkAddressHandler = (e) => {
        e.preventDefault();
        currentAddress()

    };


    const setTaxHandler = (e) => {
        e.preventDefault();
        setTaxs(tax).then((tx) => {
            alert(`New Tax is: ${+tx}`);
            console.log(tx)
        });
    };

    const setAddressHandler = (e) => {
        e.preventDefault();
        setfeeAddress(address).then((tx) => {
            alert(`New new Address is: ${+tx}`);
            console.log(tx)
        });
    };
    return (
        <>
            <div className="content">
                <button className="btn" onClick={boxlength}>Boxlength</button>
                <button className="btn" onClick={vaultlength}>CoinVaultlength</button>
            </div>
            <div>
                <form>
                    <input
                        type="text"
                        onChange={(e) => setFee(e.target.value)}
                    />
                    <button onClick={setFeeHandler}>Set Fee</button>
                    <button onClick={checkFeeHandler}>check Fee</button>
                </form>
            </div>
            <div>
                <form>
                    <input
                        type="text"
                        onChange={(e) => setTax(e.target.value)}
                    />
                    <button onClick={setTaxHandler}>Set Tax</button>
                    <button onClick={checkTaxHandler}>check Tax</button>
                </form>
            </div>

            <div>
                <form>
                    <input
                        type="text"
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <button onClick={setAddressHandler}>Set Fee Address</button>
                    <button onClick={checkAddressHandler}>check Address</button>
                </form>
            </div>
        </>
    );
}

const currentFee = async () => {
    return await timlockcontract.methods
        .fee()
        .call()
        .then((tx) => {
            alert(`fee is: ${+tx}`);
        });
};

const currentTax = async () => {
    return await timlockcontract.methods
        .tax()
        .call()
        .then((tx) => {
            alert(`tax is: ${+tx}`);
        });
};

const currentAddress = async () => {
    return await timlockcontract.methods
        .feeAddress()
        .call()
        .then((tx) => {
            alert(`fee Address is: ${tx}`);
        });
};

const lockCoinlength = async () => {
    return await timlockcontract.methods
        .getCoinBoxLenght()
        .call()
        .then((tx) => {
            alert(`Vault Lenghth is: ${+tx + 1}`);
        });
};

const lockBoxlength = async () => {
    return await timlockcontract.methods
        .getStructBoxLenght()
        .call()
        .then((tx) => {
            alert(`Vault Lenghth is: ${+tx + 1}`);
        });
};

const setFees = async (fee) => {
    return await timlockcontract.methods
        .setFee(fee)
        .send({ from: '0xe746c78Cc74f81cAB77eecB9aaBbc137Be43d5d6' })

};

const setTaxs = async (tax) => {
    return await timlockcontract.methods
        .setEmergencyTax(tax)
        .send({ from: '0xe746c78Cc74f81cAB77eecB9aaBbc137Be43d5d6' })

};

const setfeeAddress = async (address) => {
    return await timlockcontract.methods
        .setFeeAddress(address)
        .send({ from: '0xe746c78Cc74f81cAB77eecB9aaBbc137Be43d5d6' })

};
