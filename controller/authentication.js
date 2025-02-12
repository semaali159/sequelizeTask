const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../models");
const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { validateLogin, validateRegister } = require("../utils/validate");
// const generateToken = require("../utils/generateToken");
const register = asynchandler(async (req, res) => {
  //validate register
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { role, name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  let user;

  if (role == "customer") {
    user = await db.Customer.create({
      role,
      name,
      email,
      password: hashedPassword,
    });
  } else if (role == "buyer") {
    user = await db.Buyer.create({
      role,
      name,
      email,
      password: hashedPassword,
    });
  } else if (role == "admin") {
    user = await db.Admin.create({
      role,
      name,
      email,
      password: hashedPassword,
    });
  } else {
    return res.status(400).json({ message: "this role is not available" });
  }
  return res
    .status(201)
    .json({
      message: "register successfully ",
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id,
    });
});

const login = asynchandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { role, email, password } = req.body;
  let user;
  if (role == "customer") {
    user = await db.Customer.findOne({ where: { email } });
  } else if (role == "buyer") {
    user = await db.Buyer.findOne({ where: { email } });
  } else if (role == "admin") {
    user = await db.Admin.findOne({ where: { email } });
  }
  if (!user) {
    return res.status(404).json({ message: "invalid email or passowrd" });
  }
  const ispasswordValid = await bcrypt.compare(password, user.password);
  if (!ispasswordValid) {
    return res.status(404).json({ message: "invalid email or passowrd" });
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );
  return res
    .status(201)
    .json({ message: "login successful ", token, id: user.id }); //token
});
module.exports = { register, login };
