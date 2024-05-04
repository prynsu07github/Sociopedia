/* eslint-disable no-undef */
import User from "../models/user.model.js";
import errorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
const isAuthenticatedUser = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(404, "Unauthorized user"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SCERET);
    const user = await User.findById(decoded.userId).select("-password");
   // console.log(user);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default isAuthenticatedUser;
