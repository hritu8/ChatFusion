import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
dotenv.config({
  path: "./.env",
});

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";
import { createUser } from "./seeders/user.js";
import { createMessagesInChat, createSingleChats } from "./seeders/chat.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";

const mongo_URI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.JWT_SECRET;
const userSocketIDs = new Map();
connectDB(mongo_URI);

const app = express();
const server = createServer(app);
const io = new Server(server, {});
// using middleware here

app.use(express.json()); // middleware to parse json data
app.use(cookieParser()); // middleware to parse cookies

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);
app.get("/", (req, res) => {
  res.send("Hello World from Express");
});

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error("Authentication failed"));
  }
  const secretKey = jwt.verify(token, process.env.JWT_SECRET);
  const isMatch = secretKey === adminSecretKey;
  if (!isMatch) {
    return next(new Error("Authentication failed"));
  }
  next();
});

io.on("connection", (socket) => {
  const user = {
    _id: "demo",
    name: "harshit",
  };
  userSocketIDs.set(user._id.toString(), socket.id);
  console.log("User connected", socket.id);
  console.log(userSocketIDs);
  socket.on(NEW_MESSAGE, async ({ chatId, members, messages }) => {
    const messageForRealTime = {
      content: messages,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    const messageForDB = {
      content: messages,
      sender: user._id,
      chat: chatId,
    };
    const memberSocket = getSockets(members);
    io.to(memberSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(memberSocket).emit(NEW_MESSAGE_ALERT, { chatId });
    console.log("New Message", messageForRealTime);
    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);
server.listen(port, () => {
  console.log(`Server is running on port ${port} in ${envMode}`);
});
export { envMode, adminSecretKey, userSocketIDs };
