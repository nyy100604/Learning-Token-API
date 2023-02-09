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
  console.log("A request is coming into  electricCircuit api...");
  next();
});

const token = "Bearer wJYgtDMEZ0sDXmq6aujLiYDxagRkMv";

router.post("/", async (req, res) => {
  let { username, email, second, clickCount } = req.body;
  console.log(username, email, second, clickCount);

  // img(改)用google
  let gold =
    "https://drive.google.com/file/d/1mFPARrUeNUC457euPEIVREpuoJyLvaMB/view?usp=share_link";
  let silver =
    "https://drive.google.com/file/d/1edZD3D51xfHd-bj2AbiJeDetuTiZgrj2/view?usp=share_link";
  let copper =
    "https://drive.google.com/file/d/1JRFZEmt7-iJRGdQPkdiUo_hqMNHfagKH/view?usp=share_link";

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
        description:
          "電子電路-Arduino與coding(超音波感測或紅外線感測搭配蜂鳴器)",
        criteria:
          "https://docs.google.com/presentation/d/1E5kCIhApeKdrlsYEsmlAEea1OR-WB1Ic/edit?usp=share_link&ouid=101050731828865965516&rtpof=true&sd=true",
        learningContent:
          "https://drive.google.com/file/d/1CADwqhj9lWVATfn_s4EEBTS2YWjX6xLw/view?usp=sharing",
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
            "https://api.badgr.io/v2/badgeclasses/EbR32fX1SBCJu7a3ONKndA/assertions",
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
                  url: "https://drive.google.com/file/d/1CADwqhj9lWVATfn_s4EEBTS2YWjX6xLw/view?usp=sharing",
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
            console.log("X post to badgr", e);
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
        description:
          "電子電路-Arduino與coding(超音波感測或紅外線感測搭配蜂鳴器)",
        criteria:
          "https://docs.google.com/presentation/d/1E5kCIhApeKdrlsYEsmlAEea1OR-WB1Ic/edit?usp=share_link&ouid=101050731828865965516&rtpof=true&sd=true",
        learningContent:
          "https://drive.google.com/file/d/1CADwqhj9lWVATfn_s4EEBTS2YWjX6xLw/view?usp=sharing",
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
            "https://api.badgr.io/v2/badgeclasses/e6QfgjjlRhOSCNJEBo2tyg/assertions",
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
                  url: "https://drive.google.com/file/d/1CADwqhj9lWVATfn_s4EEBTS2YWjX6xLw/view?usp=sharing",
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
          "電子電路-Arduino與coding(超音波感測或紅外線感測搭配蜂鳴器)",
        criteria:
          "https://docs.google.com/presentation/d/1E5kCIhApeKdrlsYEsmlAEea1OR-WB1Ic/edit?usp=share_link&ouid=101050731828865965516&rtpof=true&sd=true",
        learningContent:
          "https://drive.google.com/file/d/1CADwqhj9lWVATfn_s4EEBTS2YWjX6xLw/view?usp=sharing",
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
            "https://api.badgr.io/v2/badgeclasses/8OMcSXdGTZOOwVAa_WpgJg/assertions",
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
                  url: "https://drive.google.com/file/d/1CADwqhj9lWVATfn_s4EEBTS2YWjX6xLw/view?usp=sharing",
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
