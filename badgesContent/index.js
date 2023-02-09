export default async function badgesContent(
  level,
  username,
  email,
  description,
  criteria,
  learningContent,
  image,
  level,
  second
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
        level,
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
}
