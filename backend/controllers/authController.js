const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 🔑 Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//
// 📝 REGISTER USER
//
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // ✅ Response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//
// 🔐 LOGIN USER
//
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // ✅ Find user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    // ✅ Check password
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    // ❌ Invalid credentials
    return res.status(401).json({
      message: "Invalid email or password",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};