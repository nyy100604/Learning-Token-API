import dotenv from "dotenv";
dotenv.config();
import Web3 from "web3";
import contractAbi from "./abi.js";
import { Common } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";
let contractAddress = "0x781495f4e7557Dd5C8f5762d21Cbd39500a02696";
let abi = contractAbi;
var web3 = new Web3(process.env.INFURA_API);
var contract = new web3.eth.Contract(abi, contractAddress);
let accountAddr = "0x54d160a7AeC0bAdDa0CF718b9989Dfff5f6f6f8C";

export default async function mintToken(address, id, ipfs, cb) {
  console.log(address, id, ipfs);
  let txCount = await web3.eth.getTransactionCount(accountAddr);
  console.log("count", txCount);
  //build transaction object
  let data = contract.methods.awardItem(address, ipfs).encodeABI();
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

  const signedTx = tx.sign(Buffer.from(process.env.PRIVATE_KET, "hex"));

  // console.log(`0x${signedTx.serialize().toString("hex")}`);

  let raw = `0x${signedTx.serialize().toString("hex")}`;

  web3.eth.sendSignedTransaction(raw, async (error, txHash) => {
    console.log(txHash);
    cb(txHash);
  });
}
