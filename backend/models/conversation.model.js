import mongoose from "mongoose";
const conversationSchema = new mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId , ref:'User'
        }
    ],
    lastMessage:{
        text:String,
        sender:{
            type:mongoose.Schema.Types.ObjectId , ref:'User'
        }
    }
},{timestamps:true})

const Conversation = new mongoose.model('conversation' , conversationSchema)

export default Conversation