import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import errorHandler from "../utils/errorHandler.js";
import {v2 as cloudinary} from 'cloudinary'

//create post
const createPost = async (req, res, next) => {
  try {
    const {text} = req.body;
    let {image} = req.body
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(errorHandler(400, "User not found"));
    }
    if (!text) {
      return next(errorHandler(400, "Caption is required"));
    }
    if(image){
      const res = await cloudinary.uploader.upload(image)
      image  = res.url
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return next(
        errorHandler(400, `Caption length should be less than ${maxLength}`)
      );
    }
    const post = await Post.create({
      postedBy: user._id,
      text,
      image,
    });
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

//get post
const getPost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

//delete post
const deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return next(errorHandler(401, "You can not delete others post"));
    }
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//like and unlike post
const likeUnlikePost = async (req, res, next) => {
  const { id } = req.params;
  const loggedUserId = req.user._id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    const isLiked = post.likes.includes(loggedUserId);
    if (isLiked) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: loggedUserId } });
      return res.status(201).json({
        success: true,
        message: "Unliked the post",
      });
    } else {
      await Post.findByIdAndUpdate(id, { $push: { likes: loggedUserId } });
    }
    res.status(201).json({
      success: true,
      message: "Liked the post",
    });
  } catch (error) {
    next(error);
  }
};

//reply to post
const replyToPost = async (req, res, next) => {
  const { text } = req.body;
  const { id } = req.params;
  const loggedUserId = req.user._id
  const {username , avatar} = req.user
  try {
    const post = await Post.findById(id);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }
    if (!text) {
      return next(errorHandler(400, "Can not add empty reply"));
    }
    const reply = {userId:loggedUserId , text , userAvatar:avatar , username}
    post.replies.push(reply)
    await post.save();
    res.status(201).json({
      success: true,
      message: "Replied successfully",
    });                                      
  } catch (error) {
    next(error);
  }
};

//get the feed post
const getFeedPost = async(req,res,next)=>{
  try {
    const userId = req.user._id
    const user = await User.findById(userId)
    if(!user){
      return next(errorHandler(404 , "User not found"))
    }
    const feedPosts = await Post.find({postedBy:{$in:user.following}}).sort({createdAt:-1})
    res.status(200).json({
      success:true,
      feedPosts
    })
  } catch (error) {
    next(error)
  }
}

//get user posts
const getUserPosts = async(req,res,next)=>{
  const {username} = req.params
  try {
    const user = await User.findOne({username})
    if(!user){
      return next(errorHandler(404 , "User not found"))
    }
    const posts = await Post.find({postedBy:user._id}).sort({createdAt:-1})
    res.status(200).json({
      success:true,
      posts
    })
  } catch (error) {
    next(error)
  }
}

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPost , getUserPosts};
