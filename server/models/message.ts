import mongoose from "mongoose";

const message = new mongoose.Schema({
  sender: String,
  receiver: String,
  text:String,
  read: { type: Boolean, default: false },
  date: Date,
});

export const Message = mongoose.model("Message", message);