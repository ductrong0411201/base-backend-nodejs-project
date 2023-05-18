const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwtGenerator = require("../utils/jwt-generator");

exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const old_user = await User.findOne({ where: { email } });
    if (old_user) {
      return res
        .status(401)
        .json({ status: 401, error: "User already exist!" });
    }
    const salt = await bcrypt.genSalt(12);
    const hashed_password = await bcrypt.hash(password, salt);
    const new_user = await User.create({
      name,
      email,
      password: hashed_password,
    });
    res.json({
      id: new_user.id,
      name: new_user.name,
      email: new_user.email,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: 401, error: "Invalid Credential" });
    }
    const isMatch = await bcrypt.compare(password, user.password); // Compare the hashed password with the user's input using bcrypt
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credential" });
    }
    const token = jwtGenerator(user.id);
    return res
      .cookie("token", token, { httpOnly: true })
      .json({ status: "Success", token: token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    res
      .status(200)
      .json({ status: 200, message: "Your account has been logout" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ status: 404, error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      status: 500,
      message: "Server error",
    });
  }
};
