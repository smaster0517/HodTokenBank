// import { useState } from "react";
// import Web3 from "web3";
// import dBank from "./abis/dBank.json";

// export default async function BlockchainData() {
//   // const [balance, setBalance] = useState(null);
//   // const [account, setAccount] = useState("");
//   // const [starTime, setStartTime] = useState(null);
//   // const [isDeposited, setIsDeposited] = useState(false);
//   // const [timeLock, setTimeLock] = useState(null);
//   if (typeof window.ethereum !== "undefined") {
//     const web3 = new Web3(window.ethereum);
//     const netId = await web3.eth.net.getId();

//     //Load Account
//     if (typeof window.ethereum !== "undefined") {
//       const accounts = await web3.eth.getAccounts();
//       setAccount(accounts[0]);
//       console.log(account);
//     } else {
//       window.alert("Please login with MetaMask");
//     }
//   }

//   async function getblockTime() {
//     if (typeof window.ethereum !== "undefined") {
//     }
//   }
// }
