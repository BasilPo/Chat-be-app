const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Message = require("../models/message");
const validator = require("../helpers/validator");
const getError = require("../helpers/getError");

module.exports = {
  async signUp({ userInput }) {
    let { name, email, password } = userInput;

    if (
      validator.isValidStr(name) &&
      validator.isValidStr(password, { minLength: 6 }) &&
      validator.isValidEmail(email)
    ) {
      const candidate = await User.findOne({ email });

      if (candidate) {
        throw getError("A user already exists", 409);
      }

      const hashPassword = await bcrypt.hash(password, 12);
      const savedUser = await new User({
        name,
        email,
        password: hashPassword,
      }).save();

      const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });

      return { token, userId: savedUser._id };
    } else {
      throw getError("Missing required fields", 422);
    }
  },

  async logIn({ email, password }) {
    const candidate = await User.findOne({ email });

    if (!candidate) {
      throw getError("A user not found", 401);
    }

    const isPasswordEqual = await bcrypt.compare(password, candidate.password);

    if (!isPasswordEqual) {
      throw getError("Wrong password", 401);
    }

    const token = jwt.sign({ userId: candidate._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    return { token, userId: candidate._id };
  },

  async user({}, req) {
    if (!req.isAuth) {
      throw getError("Not authenticated", 401);
    }

    const candidate = await User.findById(req.userId);

    if (!candidate) {
      throw getError("A user not found", 404);
    }

    const { _id, name, email } = candidate.to;

    return { _id, name, email };
  },

  async addMessage({ text }, req) {
    if (!req.isAuth) {
      throw getError("Not authenticated", 401);
    }

    if (!validator.isValidStr(text)) {
      throw getError("Missing required field", 422);
    }

    const candidate = await User.findById(req.userId);

    if (!candidate) {
      throw getError("Invalid user", 401);
    }

    const savedMessage = await new Message({ text, creator: candidate }).save();

    return {
      _id: savedMessage._id,
      text: savedMessage.text,
      creator: savedMessage.creator,
      createdAt: savedMessage.createdAt,
    };
  },

  async messages({}, req) {
    if (!req.isAuth) {
      throw getError("Not authenticated", 401);
    }

    const messages = await Message.find()
      .sort({ createdAt: 1 })
      .populate("creator");

    return messages;
  },
};
