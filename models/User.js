import { getUserModel, userSchemaConfig } from "@/libs/model";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  ...userSchemaConfig,
});
const User = getUserModel(userSchema);

export default User;
