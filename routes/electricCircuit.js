import express from "express";
import badges from "../badgesContent/index";
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("A request is coming into  electricCircuit api...");
  next();
});

const token = "Bearer 0F8kSwtJrPxaL4NWbWhQoyl0AByvsx";

// badges img
const gold =
  "https://drive.google.com/file/d/1mFPARrUeNUC457euPEIVREpuoJyLvaMB/view?usp=share_link";
const silver =
  "https://drive.google.com/file/d/1edZD3D51xfHd-bj2AbiJeDetuTiZgrj2/view?usp=share_link";
const copper =
  "https://drive.google.com/file/d/1JRFZEmt7-iJRGdQPkdiUo_hqMNHfagKH/view?usp=share_link";

//badges information
const contentdescription =
  "電子電路-Arduino與coding(超音波感測或紅外線感測搭配蜂鳴器)";
const criteria =
  "https://docs.google.com/presentation/d/1E5kCIhApeKdrlsYEsmlAEea1OR-WB1Ic/edit?usp=share_link&ouid=101050731828865965516&rtpof=true&sd=true";
const learningContent =
  "https://drive.google.com/file/d/1CADwqhj9lWVATfn_s4EEBTS2YWjX6xLw/view?usp=sharing";

router.post("/", async (req, res) => {
  let { username, email, second } = req.body;
  console.log(username, email, second);

  if (second <= 1800) {
    const goldBadgrApi =
      "https://api.badgr.io/v2/badgeclasses/EbR32fX1SBCJu7a3ONKndA/assertions";

    badges(
      "金",
      username,
      email,
      contentdescription,
      criteria,
      learningContent,
      gold,
      second,
      goldBadgrApi,
      token
    );
  } else if ((second > 1800) & (second <= 3000)) {
    const silverBadgrApi =
      " https://api.badgr.io/v2/badgeclasses/e6QfgjjlRhOSCNJEBo2tyg/assertions";
    badges(
      "銀",
      username,
      email,
      contentdescription,
      criteria,
      learningContent,
      silver,
      second,
      silverBadgrApi,
      token
    );
  } else {
    const copperBadgrApi =
      "https://api.badgr.io/v2/badgeclasses/8OMcSXdGTZOOwVAa_WpgJg/assertions";
    badges(
      "銅",
      username,
      email,
      contentdescription,
      criteria,
      learningContent,
      copper,
      second,
      copperBadgrApi,
      token
    );
  }
});

export default router;
