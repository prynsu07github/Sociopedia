import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToeknAndSetCookie from "../utils/generateTokenAndSetCookies.js";
import errorHandler from "../utils/errorHandler.js";
import {v2 as cloudinary} from 'cloudinary';
import mongoose from "mongoose";

//get profile
const getProfile = async (req, res, next) => {
  const {query} = req.params
  try {
    let user;
    if(mongoose.isValidObjectId(query)){
      user = await User.findOne({_id:query}).select("-password")
    }else{
      user = await User.findOne({username:query}).select("-password")
    }
    if(!user){
      return next(errorHandler(400 , "User not found"))
    }
    res.status(200).json({
      success:true,
      user
    })
  } catch (error) {
    next(error)
  }
}

//register
const register = async (req, res, next) => {
  try {
    const { username, name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Username or email is already in use",
      });
    }
    const newUser = await User.create({
      username,
      name,
      password: hashedPassword,
      email,
    });
    if (newUser) {
      generateToeknAndSetCookie(newUser._id, res);
      res.status(200).json({
        success: true,
        message: "User register successfully",
        user: {
          name:newUser.name,
          username:newUser.username,
          email:newUser.email,
          id:newUser._id,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

//login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const verifiedPass = await bcrypt.compare(password, user.password);
    if (!verifiedPass) {
      return next(errorHandler(404, "Invalid username and password"));
    }
    
    user.isFrozen = false
    await user.save()

    generateToeknAndSetCookie(user._id, res);
    user.password = "password can not be shown"
    res.status(200).json({
      success: true,
      message: "User logged in",
      user,
    });
  } catch (error) {
    next(error);
  }
};

//logout
const logout = async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    next(error);
  }
};

//followAndUnfollowUser
const followAndUnfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const loggedUser = await User.findById(req.user._id);
    if (!userToModify) {
      return next(errorHandler(400, "User not found"));
    }
    if (id === String(req.user._id)) {
      return next(errorHandler(404, "You can not follow/unfollow yourself"));
    }
    const isFollowed = loggedUser.following.includes(id);
    if (isFollowed) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    next(error);
  }
};

//update profile
const updateUserProfile = async (req, res, next) => {
  //console.log(req.body);
  const { name, username, avatar, email, password, bio } = req.body;
  const { id } = req.params;
  try {
    if (id !== req.user._id.toString()) {
      return next(errorHandler(400, "User not found"));
    }
    const user = await User.findById(id);
    if(username!==user.username){
      const isUsernameExist = await User.findOne({username})
      if(isUsernameExist){
        return next(errorHandler(400 , "Username already in use"))
      }
      else{
        user.username = username 
      }
    }
    if(avatar){
      if(user.avatar){
        await cloudinary.uploader.destroy(user.avatar.split('/').pop().split('.')[0])
      }
      const res = await cloudinary.uploader.upload(avatar)
      console.log(res);
      user.avatar = res.url
    }
    if(password){
      const hashedPassword = bcrypt.hashSync(password , 10)
      user.password = hashedPassword
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    await user.save();
    res.status(200).json({
      success:true,
      message:"Profile updated successfully",
      user
    })
  } catch (error) {
    next(error);
  }
};

//freeze account
const freezeAccount = async(req,res,next) => {
  try {
    const user = await User.findById(req.user._id)
    if(!user){
      return next(errorHandler(404 , 'User not found'))
    }
    user.isFrozen = true
    await user.save()
    res.status(200).json({
      success:true,
      message:'Account freezed successfully'
    })
  } catch (error) {
    next(error)
  }
}

const getSuggestedUsers = async (req, res , next) => {
	try {
		// exclude the current user from suggested users array and exclude users that current user is already following
		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
		const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(
      {success:true ,suggestedUsers});
	} catch (error) {
		next(error)
	}
};

export { register, login, logout, followAndUnfollowUser, updateUserProfile , getProfile,freezeAccount,getSuggestedUsers };
