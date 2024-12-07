import newDatabase from "./database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Change this boolean to true if you wish to keep your
// users between restart of your application
const isPersistent = true;
const database = newDatabase({ isPersistent });
const SECRET_KEY = "eBg8xnpkNZI23HBvrdZwlMAyfOB6xHzA";

// Create middlewares required for routes defined in app.js
export const register = async (req, res) => {
  const { username, password } = req.body;
  console.log("Received register request:", req.body);
  const SALT_ROUNDS = 12;
  if (!username || !password) {
    res.status(400).send({ message: "Username and password are required" });
    return;
  }
  const allUsers = database.getAll();
  const existingUser = allUsers.find((user) => user.username === username);
  if (existingUser) {
    res.status(409).send({ message: "Username already exists" });
    return;
  }
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = {
      username,
      password: hashedPassword,
    };
    const storedUser = database.create(newUser);
    console.log("storedUser", storedUser);
    res.status(201).send({
      id: storedUser.id,
      username: storedUser.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: " Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }
  const allUsers = database.getAll();
  const user = allUsers.find((user) => user.username === username);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(201).send({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
export const getProfile = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .send({ message: "Authorization token missing or invalid" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;
    const user = database.getById(userId);
    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }
    res.status(200).send({
      message: `Profile retrieved successfully! ${user.username}`,
      username: user.username,
    });
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};
export const logout = (req, res) => {
  res.status(204).send({ message: "Logout successfully!" });
};

// You can also create helper functions in this file to help you implement logic
// inside middlewares
