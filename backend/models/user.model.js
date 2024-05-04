import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot exceeded 30 character "],
    minLength: [4, "Name should have more than 4 charater"],
  },
  username:{
    type:String,
    //unique:true,
    minLength: [4, "Username should have more than 4 charater"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter your email"],
    validate: {
      validator: function(value) {
          return validator.isEmail(value);
      },
      message: "Please enter a valid email"
  }
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should have minimum 8 charaters"],
  },
  avatar:{
    type:String,
    default:''
  },
  followers:{
    type:[String],
    default:[]
  },
  following:{
    type:[String],
    default:[]
  },
  bio:{
    type:String,
    default:''
  },
  isFrozen:{
    type:Boolean,
    default:false
  }
} , {
    timestamps:true
});


const User = mongoose.model("User", userSchema);

export default User;
