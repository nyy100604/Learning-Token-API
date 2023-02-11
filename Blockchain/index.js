import Web3 from "web3";

import contractAbi from "./abi.js";

var web3 = new Web3(
  "https://goerli.infura.io/v3/349f49a249954f1f9bceaa3b6c792beb"
);
import { Common } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";

let { address } = web3.eth.accounts.create();
let contractAddress = "0x781495f4e7557Dd5C8f5762d21Cbd39500a02696";
let abi = contractAbi;
var contract = new web3.eth.Contract(contractAbi, contractAddress);
let accountAddr = "0x54d160a7AeC0bAdDa0CF718b9989Dfff5f6f6f8C";
let privateKey = process.env.privateKey;

export default async function mintToken(address, id, ipfs, cb) {
  console.log(address, id, ipfs);
  let data = contract.methods.awardItem(address, id, ipfs).encodeABI();
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
