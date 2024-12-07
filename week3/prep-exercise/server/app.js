import express from "express";

import path from "path";
import { fileURLToPath } from "url";
import { register, login, getProfile, logout } from "./users.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});
app.post("/auth/register", register);
app.post("/auth/login", login);
app.get("/auth/profile", getProfile);
app.post("/auth/logout", logout);

app.use(express.static(path.join(__dirname, "../client")));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
