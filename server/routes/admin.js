import express from "express";
import {
  adminLogin,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { logout } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.get("/", getAdminData);
app.post("/verify", adminLoginValidator(), validateHandler, adminLogin);
app.get("/logout", logout);

// only admin can access these routes
app.use(adminOnly);
app.get("/users", allUsers);
app.get("/chats", allChats);
app.get("/messages", allMessages);
app.get("/stats", getDashboardStats);
export default app;
