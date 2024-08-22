import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOption = {
  marAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};
// connect db
const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "ChatFusion" })
    .then((data) => {
      console.log(`connected to DB: ${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};
const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  console.log(token);
  return res
    .status(code)
    .cookie("chattu-token", token, cookieOption)
    .json({ success: true, message });
};

const emitEvent = (req, event, users, data) => {
  console.log("emiting event", event);
};
const deleteFilesFromCloudinary = async (public_ids) => {
  // Delete from cloudinary
};

export {
  connectDB,
  sendToken,
  cookieOption,
  emitEvent,
  deleteFilesFromCloudinary,
};
