const express = require('express');
const router = express.Router();

//Import the User Model
const userModel = require("../model/User");

const productModel = require("../model/product");

const catModel = require("../model/cat");

const Cart = require("../model/cart");

const bcrypt = require("bcryptjs");

const path = require("path");

const isAuthenticated = require("../middleware/auth");

const dashboardLoader = require("../middleware/authorization");