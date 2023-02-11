import express from "express";
import badges from "../badgesContent/index.js";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

router.get("/", (req, res, next) => {
  console.log("A request is coming into  woodWorking api...");
  next();
});

// badges img
let gold =
  "https://drive.google.com/file/d/1gZsVv5mfSrgmeBgNdPLE8bx4M6682QOo/view";
let silver =
  "https://drive.google.com/file/d/1W6MFxB_EsiGBziCEwfXL73XtX70V96iR/view?usp=share_link";
let copper =
  "https://drive.google.com/file/d/14RnkrmP3gpyg1L69y-YFbnjXhDBvEWaP/view?usp=share_link";

//badges information
const contentdescription = "手工具的使用與維護(線鋸與砂紙)";
const criteria =
  "https://drive.google.com/file/d/1273x5N_Ct-yeSqe3Qtt1HEbUy37J027m/view?usp=share_link";
const learningContent =
  "https://drive.google.com/file/d/1MubIdTmmyE5tiWrcItg4TgEAsOQuE9dI/view?usp=share_link";

router.post("/", async (req, res) => {
  let { username, email, second } = req.body;
  console.log(username, email, second);

  if (second <= 1800) {
    const goldBadgrApi =
      "https://api.badgr.io/v2/badgeclasses/B3hAftKITbaDm996H6-KuQ/assertions";

    let result = await badges(
      "金",
      username,
      email,
      contentdescription,
      criteria,
      learningContent,
      gold,
      second,
      goldBadgrApi,
      (result) => {
        res.status(200).send(result);
      }
    );
  } else if ((second > 1800) & (second <= 3000)) {
    const silverBadgrApi =
      "https://api.badgr.io/v2/badgeclasses/sGbVNJfwTjOX3zJ3WXQl-A/assertions";
    let result = badges(
      "銀",
      username,
      email,
      contentdescription,
      criteria,
      learningContent,
      silver,
      second,
      silverBadgrApi,
      (result) => {
        res.status(200).send(result);
      }
    );
    res.status(200).send(result);
  } else {
    const copperBadgrApi =
      "https://api.badgr.io/v2/badgeclasses/gMY9RnnGQ66mTWQAuyPcsw/assertions";
    let result = badges(
      "銅",
      username,
      email,
      contentdescription,
      criteria,
      learningContent,
      copper,
      second,
      copperBadgrApi,
      (result) => {
        res.status(200).send(result);
      }
    );
    res.status(200).send(result);
  }
});

export default router;
