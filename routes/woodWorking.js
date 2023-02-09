import express from "express";
import axios from "axios";
import { create, globSource } from "ipfs-http-client";
import fs from "fs";
import User from "../models/user-model.js";
import Web3 from "web3";
import mintToken from "../Blockchain/index.js";
var web3 = new Web3(
  "https://goerli.infura.io/v3/349f49a249954f1f9bceaa3b6c792beb"
);
const ipfs = create();
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("A request is coming into  woodWorking api...");
  next();
});

const token = "Bearer wJYgtDMEZ0sDXmq6aujLiYDxagRkMv";

router.post("/", async (req, res) => {
  let { username, email, second, clickCount } = req.body;
  console.log(username, email, second, clickCount);

  //img(改)
  let gold =
    "https://drive.google.com/file/d/1gZsVv5mfSrgmeBgNdPLE8bx4M6682QOo/view";
  let silver =
    "https://drive.google.com/file/d/1W6MFxB_EsiGBziCEwfXL73XtX70V96iR/view?usp=share_link";
  let copper =
    "https://drive.google.com/file/d/14RnkrmP3gpyg1L69y-YFbnjXhDBvEWaP/view?usp=share_link";

  if (second <= 1800) {
    //Level、image、posr url、
    let level = "金";

    // nft metadata
    const badgesInfo = {
      issuer: "National Taiwan Normal University",
      recipient: {
        username,
        email,
      },
      badgesInformation: {
        description: "手工具的使用與維護(線鋸與砂紙)",
        criteria:
          "https://drive.google.com/file/d/1273x5N_Ct-yeSqe3Qtt1HEbUy37J027m/view?usp=share_link",
        learningContent:
          "https://drive.google.com/file/d/1MubIdTmmyE5tiWrcItg4TgEAsOQuE9dI/view?usp=share_link",
      },
      achievement: {
        image: gold,
        level,
        time: `${second}秒`,
      },
    };

    let data = JSON.stringify(badgesInfo);

    fs.writeFile("badgesInfo.json", data, (e) => {
      if (e) throw e;
      console.log("File has been written.");
    });

    for await (const file of ipfs.addAll(
      globSource("./badgesInfo.json", "**/*")
    )) {
      let tokenId;
      console.log(`ipfs.io/ipfs/${file.path}`);
      let userLength = await User.find({});
      tokenId = userLength.length + 1;

      // distribute tokens
      let { address } = web3.eth.accounts.create();
      mintToken(address, tokenId, `ipfs.io/ipfs/${file.path}`, async (hash) => {
        console.log(hash);
        let blockchainWebsite = `https://goerli.etherscan.io/tx/${hash}`;
        //store into DB
        const newUser = new User({
          username,
          email,
          level: "金",
          time: second,
          ipfsHref: `ipfs.io/ipfs/${file.path}`,
          blochainHref: blockchainWebsite,
        });
        try {
          const savedUser = await newUser.save();
        } catch (e) {
          res.status(400).send("User not saved.");
        }
        axios
          .post(
            "https://api.badgr.io/v2/badgeclasses/B3hAftKITbaDm996H6-KuQ/assertions",
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
                  url: "https://drive.google.com/file/d/1MubIdTmmyE5tiWrcItg4TgEAsOQuE9dI/view?usp=share_link",
                  narrative: "Living Technology Knowledge",
                },
              ],
              notify: true,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((data) => {
            console.log(data.data.result);
            res.status(200).send(data.data.result);
          })
          .catch((e) => {
            console.log(e);
            res.status(404).send(e);
          });
      });
    }
  } else if ((second > 1800) & (second <= 3000)) {
    let level = "銀";
    const badgesInfo = {
      issuer: "National Taiwan Normal University",
      recipient: {
        username,
        email,
      },
      badgesInformation: {
        description: "手工具的使用與維護(線鋸與砂紙)",
        criteria:
          "https://drive.google.com/file/d/1273x5N_Ct-yeSqe3Qtt1HEbUy37J027m/view?usp=share_link",
        learningContent:
          "https://drive.google.com/file/d/1MubIdTmmyE5tiWrcItg4TgEAsOQuE9dI/view?usp=share_link",
      },
      achievement: {
        image: silver,
        level,
        time: `${second}秒`,
      },
    };

    let data = JSON.stringify(badgesInfo);

    fs.writeFile("badgesInfo.json", data, (e) => {
      if (e) throw e;
      console.log("File has been written.");
    });

    for await (const file of ipfs.addAll(
      globSource("./badgesInfo.json", "**/*")
    )) {
      let tokenId;
      console.log(`ipfs.io/ipfs/${file.path}`);
      let userLength = await User.find({});
      tokenId = userLength.length + 1;

      // distribute tokens
      let { address } = web3.eth.accounts.create();
      mintToken(address, tokenId, `ipfs.io/ipfs/${file.path}`, async (hash) => {
        console.log(hash);
        let blockchainWebsite = `https://goerli.etherscan.io/tx/${hash}`;
        //store into DB
        const newUser = new User({
          username,
          email,
          level: "銀",
          time: second,
          ipfsHref: `ipfs.io/ipfs/${file.path}`,
          blochainHref: blockchainWebsite,
        });
        try {
          const savedUser = await newUser.save();
        } catch (e) {
          res.status(400).send("User not saved.");
        }
        axios
          .post(
            "https://api.badgr.io/v2/badgeclasses/sGbVNJfwTjOX3zJ3WXQl-A/assertions",
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
                  url: "https://drive.google.com/file/d/1MubIdTmmyE5tiWrcItg4TgEAsOQuE9dI/view?usp=share_link",
                  narrative: "Living Technology Knowledge",
                },
              ],
              notify: true,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((data) => {
            console.log(data.data.result);
            res.status(200).send(data.data.result);
          })
          .catch((e) => {
            console.log(e);
            res.status(404).send(e);
          });
      });
    }
  } else {
    let level = "銅";

    const badgesInfo = {
      issuer: "National Taiwan Normal University",
      recipient: {
        username,
        email,
      },
      badgesInformation: {
        description:
          "ipfs.io/ipfs/QmcyS3QQZxeSdqDtZWogmLcYoYG44TVMGxGBhBE6yvWQCv",
        criteria:
          "https://drive.google.com/file/d/1273x5N_Ct-yeSqe3Qtt1HEbUy37J027m/view?usp=share_link",
        learningContent:
          "https://drive.google.com/file/d/1MubIdTmmyE5tiWrcItg4TgEAsOQuE9dI/view?usp=share_link",
      },
      achievement: {
        image: copper,
        level,
        time: `${second}秒`,
      },
    };

    let data = JSON.stringify(badgesInfo);

    fs.writeFile("badgesInfo.json", data, (e) => {
      if (e) throw e;
      console.log("File has been written.");
    });

    for await (const file of ipfs.addAll(
      globSource("./badgesInfo.json", "**/*")
    )) {
      let tokenId;
      console.log(`ipfs.io/ipfs/${file.path}`);
      let userLength = await User.find({});
      tokenId = userLength.length + 1;

      // distribute tokens
      let { address } = web3.eth.accounts.create();
      mintToken(address, tokenId, `ipfs.io/ipfs/${file.path}`, async (hash) => {
        console.log(hash);
        let blockchainWebsite = `https://goerli.etherscan.io/tx/${hash}`;
        //store into DB
        const newUser = new User({
          username,
          email,
          level: "銅",
          time: second,
          ipfsHref: `ipfs.io/ipfs/${file.path}`,
          blochainHref: blockchainWebsite,
        });
        try {
          const savedUser = await newUser.save();
        } catch (e) {
          res.status(400).send("User not saved.");
        }
        axios
          .post(
            "https://api.badgr.io/v2/badgeclasses/gMY9RnnGQ66mTWQAuyPcsw/assertions",
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
                  url: "https://drive.google.com/file/d/1MubIdTmmyE5tiWrcItg4TgEAsOQuE9dI/view?usp=share_link",
                  narrative: "Living Technology Knowledge",
                },
              ],
              notify: true,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          )
          .then((data) => {
            console.log(data.data.result);
            res.status(200).send(data.data.result);
          })
          .catch((e) => {
            console.log(e);
            res.status(404).send(e);
          });
      });
    }
  }
});

export default router;
