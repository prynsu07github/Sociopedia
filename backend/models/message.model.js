import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId , ref:'Conversation'
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId , ref:'User'
    },
    text:String,
},{timestamps:true})

const Message = new mongoose.model('Message' , messageSchema)

export default Message