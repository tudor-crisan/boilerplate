import mongoose from "mongoose";
import { userSchemaConfig, getUserModel } from "@/libs/model";

const userSchema = new mongoose.Schema({
  ...userSchemaConfig,
});
const User = getUserModel(userSchema);

export default User;