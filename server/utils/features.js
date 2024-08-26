import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import { v2 as cloudinary } from "cloudinary";
import { getBase64, getSockets } from "../lib/helper.js";

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
    .json({ success: true, user, message });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const userSocket = getSockets(users);
  io.to(userSocket).emit(event, data);
};

const uploadFilesToCloudinary = async (files = []) => {
  // Upload  to cloudinary
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  });
  try {
    const results = await Promise.all(uploadPromises);
    const formattedResult = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResult;
  } catch (err) {
    throw new Error("Error uploading files to cloudinary", err);
  }
};

const deleteFilesFromCloudinary = async (public_ids) => {
  // Delete from cloudinary
};

export {
  connectDB,
  sendToken,
  cookieOption,
  emitEvent,
  uploadFilesToCloudinary,
  deleteFilesFromCloudinary,
};
