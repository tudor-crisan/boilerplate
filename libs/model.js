import mongoose from "mongoose";

export const userSchemaConfig = {
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  image: {
    type: String
  },
  hasAccess: {
    type: Boolean,
    default: false
  },
  customerId: {
    type: String
  }
}

export const getUserModel = (schema) => {
  return mongoose.models.User || mongoose.model("User", schema);
}
