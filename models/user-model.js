import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    require: true,
    minLength: 6,
    maxLength: 100,
  },
  level: {
    type: String,
    require: true,
  },
  time: {
    type: Number,
    require: true,
  },
  ipfsHref: {
    type: String,
    require: true,
  },
  blochainHref: {
    type: String,
    require: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
