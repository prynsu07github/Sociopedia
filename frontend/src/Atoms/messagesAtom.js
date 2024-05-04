import { atom } from "recoil";

const conversationAtom = atom({
    key:"userConversations",
    default:[]
})

const selectedConversationAtom = atom({
    key:"selectedConversation",
    default:{
        _id:"",
        userId:"",
        username:"",
        avatar:"",
        name:"",
    }
})

export {selectedConversationAtom}
export default conversationAtom