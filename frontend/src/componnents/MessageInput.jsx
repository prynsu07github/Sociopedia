import { Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { IoSendSharp } from "react-icons/io5"
import useShowToast from "../hooks/useShowToast"
import { useState } from "react"
import conversationAtom, { selectedConversationAtom } from "../Atoms/messagesAtom"
import { useRecoilState, useSetRecoilState } from "recoil"

const MessageInput = ({setMessages}) => {

  const showToast = useShowToast()
  const [messageText , setMessageText]= useState("")
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const setConversations = useSetRecoilState(conversationAtom);

  const handleMessageSend = async(e)=>{
    e.preventDefault();
    if(!messageText) return
    try {
      const res = await fetch('/api/messages' , {
        method:"POST",
        headers:{
          'Content-type':"Application/json"
        },
        body:JSON.stringify({
          receiverId:selectedConversation?.userId,
          message:messageText
        })
      })
      const data = await res.json()
      if(!data.success){
        showToast(data.message , 'error')
        return 
      }
       setMessages((message)=>[...message , data.message])

       setConversations(prevConversation => {
        const updatedConversation = prevConversation.map(conversation => {
          if(conversation._id === selectedConversation._id){ 
            return {
              ...conversation , 
              lastMessage:{
                text:messageText,
                sender:data.message.sender
              }
            }
          }
          return conversation
        })
        return updatedConversation
       })
       setMessageText("")
    } catch (error) {
      showToast(error.message , 'error')
    }
  }
  return (
    <form onSubmit={handleMessageSend}>
        <InputGroup>
        <Input value={messageText} placeholder="Type a message..." onChange={(e)=>setMessageText(e.target.value)}/>
        <InputRightElement cursor={'pointer'} onClick={handleMessageSend}>
        <IoSendSharp size={23}/>
        </InputRightElement>
        </InputGroup>
    </form>
  )
}

export default MessageInput