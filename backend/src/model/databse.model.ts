import mongoose, { mongo } from "mongoose";
import type { UIuserSchema } from "../types/main.type.js";

const User_login =  new mongoose.Schema <UIuserSchema> ({
  googleId: {
    type: String,
    require: true,
  },
  refreshToken: {
    type: String,
    require: true,
  },
  email: String,
  name: String,
  avatar: String,
  role: {
    type: String,
    require: true,
  },
});

export const userOauth = mongoose.model("userOauth", User_login)