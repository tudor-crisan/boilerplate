
import mongoose from "mongoose";
import { userSchemaConfig, getUserModel } from "@/libs/model";

const userSchema = new mongoose.Schema({
  ...userSchemaConfig,
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board"
    }
  ]
});

const User = getUserModel(userSchema);

export default User;
