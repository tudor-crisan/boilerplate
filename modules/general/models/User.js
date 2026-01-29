import { getUserModel, userSchemaConfig } from "@/modules/general/libs/model";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  ...userSchemaConfig,
});
const User = getUserModel(userSchema);

export default User;
