const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const SALT_ROUNDS = 12;

const signToken = (user) =>
  jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  provider: user.provider,
});

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const displayName = name || email.split("@")[0];

    const user = await prisma.user.create({
      data: {
        name: displayName,
        email,
        password: hashedPassword,
        role: "user",
        provider: "local",
        providerId: null,
      },
    });

    const token = signToken(user);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    try {
      const fs = require("fs");
      fs.appendFileSync("error.log", `${new Date().toISOString()} - REGISTER ERROR: ${error.message}\n${error.stack}\n\n`);
    } catch (e) {
      console.error("Failed to write to error.log", e);
    }
    res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    try {
      const fs = require("fs");
      fs.appendFileSync("error.log", `${new Date().toISOString()} - LOGIN ERROR: ${error.message}\n${error.stack}\n\n`);
    } catch (e) {
      console.error("Failed to write to error.log", e);
    }
    res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error(error);
    try {
      const fs = require("fs");
      fs.appendFileSync("error.log", `${new Date().toISOString()} - GET ME ERROR: ${error.message}\n${error.stack}\n\n`);
    } catch (e) {
      console.error("Failed to write to error.log", e);
    }
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

exports.issueTokenForUser = (user) => signToken(user);

exports.sanitizeUser = sanitizeUser;
