import Web3 from "web3";

import contractAbi from "./abi.js";
var web3 = new Web3(
  "https://goerli.infura.io/v3/349f49a249954f1f9bceaa3b6c792beb"
);
import { Common } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";

let { address } = web3.eth.accounts.create();
let contractAddress = "0x2C3210ceEf8437709E9F1c09Fd5f4441D145031E";
let abi = contractAbi;
var contract = new web3.eth.Contract(contractAbi, contractAddress);
let accountAddr = "0x54d160a7AeC0bAdDa0CF718b9989Dfff5f6f6f8C";
let privateKey =
  "0f58beb0ee38e7ebf6e133c1b2ae8bfae36e7c6be2bb72c77af96a64714a7202";

export default async function mintToken(address, id, ipfs, cb) {
  console.log(address, id, ipfs);
  let data = contract.methods.safeMint(address, id, ipfs).encodeABI();
  await web3.eth.getTransactionCount(accountAddr, (e, txCount) => {
    console.log(txCount);
    //build transaction object
    const txData = {
      from: accountAddr,
      nonce: txCount,
      gasPrice: web3.utils.toHex(web3.utils.toWei("20", "gwei")),
      gasLimit: web3.utils.toHex(1000000),
      to: contractAddress,
      data,
    };

    const common = Common.custom({ chainId: 5 });

    const tx = Transaction.fromTxData(txData, { common });

    const signedTx = tx.sign(Buffer.from(privateKey, "hex"));

    // console.log(`0x${signedTx.serialize().toString("hex")}`);

    let raw = `0x${signedTx.serialize().toString("hex")}`;

    web3.eth.sendSignedTransaction(raw, async (error, txHash) => {
      console.log(txHash);
      cb(txHash);
    });
  });
}
