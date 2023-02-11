import dotenv from "dotenv";
dotenv.config();
import Web3 from "web3";
import User from "../models/user-model.js";
import axios from "axios";
import mintToken from "../Blockchain/index.js";
import fs from "fs";
import { create, globSource } from "ipfs-http-client";
const ipfs = create();
var web3 = new Web3(process.env.INFURA_API);

export default async function badgesContent(
  level,
  username,
  email,
  description,
  criteria,
  learningContent,
  image,
  second,
  badgrApi,
  resData
) {
  // nft metadata
  const badgesInfo = {
    issuer: "National Taiwan Normal University",
    recipient: {
      username,
      email,
    },
    badgesInformation: {
      description,
      criteria,
      learningContent,
    },
    achievement: {
      image,
      level,
      time: `${second}秒`,
    },
  };

  let data = JSON.stringify(badgesInfo);

  fs.writeFile("badgesInfo.json", data, (e) => {
    if (e) throw e;
    console.log(`${username}'s badge has been written.`);
  });

  for await (const file of ipfs.addAll(
    globSource("./badgesInfo.json", "**/*")
  )) {
    let tokenId;
    console.log(`ipfs.io/ipfs/${file.path}`);

    let userLength = await User.find({});
    tokenId = userLength.length + 1;

    // distribute tokens

    //create a account
    let { address } = web3.eth.accounts.create();
    mintToken(address, tokenId, `ipfs.io/ipfs/${file.path}`, async (hash) => {
      console.log(hash);
      let blockchainWebsite = `https://goerli.etherscan.io/tx/${hash}`;
      //store into DB
      const newUser = new User({
        username,
        email,
        level,
        time: second,
        ipfsHref: `ipfs.io/ipfs/${file.path}`,
        blochainHref: blockchainWebsite,
      });
      try {
        await newUser.save();
      } catch (e) {
        res.status(400).send("User not saved.");
      }
      axios
        .post(
          badgrApi,
          {
            recipient: {
              identity: email,
              hashed: true,
              type: "email",
              salt: "11",
            },
            evidence: [
              {
                url: blockchainWebsite,
                narrative: "Blockchain Information",
              },
              {
                url: learningContent,
                narrative: "Living Technology Knowledge",
              },
            ],
            notify: true,
          },
          {
            headers: {
              Authorization: process.env.BADGR_TOKEN,
            },
          }
        )
        .then((data) => {
          console.log(data.data.result);
          resData({ suucess: true, result: data.data.result });
        })
        .catch((e) => {
          console.log("can't post to badgr", e);
          resData({ suucess: false, result: e });
        });
    });
  }
}
