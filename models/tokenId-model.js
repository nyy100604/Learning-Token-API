import mongoose from "mongoose";

const tokenIdSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    require: true,
  },
});

const TokenId = mongoose.model("TokenId", tokenIdSchema);
export default TokenId;
