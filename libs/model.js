import mongoose from "mongoose";

export const userSchemaConfig = {
  name: {
    type: String,
    trim: true,
    maxlength: 30,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  hasAccess: {
    type: Boolean,
    default: false,
  },
  customerId: {
    type: String,
  },
  planId: {
    type: String,
  },
  styling: {
    type: Object,
  },
};

export const getUserModel = (schema) => {
  return mongoose.models.User || mongoose.model("User", schema);
};
