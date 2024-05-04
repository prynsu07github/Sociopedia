import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import errorHandler from "../utils/errorHandler.js";

//send message
const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id; // Assuming senderId is stored in req.user._id

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    res.status(201).json({
      success: true,
      message: newMessage,
    });

    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage" ,newMessage )
    }
  } catch (error) {
    next(error);
  }
};

//get messages
const getMessages = async (req, res, next) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });
    if(!conversation){
      return next(errorHandler(404 , 'Conversation not found'))
    }
    const messages = await Message.find({
      conversationId: conversation._id,
    })
    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

//get conversations
const getUserConversations = async(req,res,next)=>{
  const userId = req.user._id
  try {
    const conversations = await Conversation.find({participants:userId}).populate({path:"participants" , select:"username avatar name"})
    if(conversations.length===0){
      return next(errorHandler(404 , 'Conversations not found'))
    }
    conversations.filter(conversation => {
      conversation.participants = conversation.participants.filter(participant => participant._id.toString() !== userId.toString())
    })
    res.status(200).json({
      success:true,
      conversations
    })
  } catch (error) {
    next(error)
  }
}

export { sendMessage, getMessages , getUserConversations };
