import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../componnents/Conversation";
import MessageContainer from "../componnents/MessageContainer";
import { useEffect, useState } from "react";
import useShowToast from '../hooks/useShowToast'
import { useRecoilState, useRecoilValue } from "recoil";
import conversationAtom, { selectedConversationAtom } from "../Atoms/messagesAtom";
import { BiSolidChat } from "react-icons/bi";
import userAtom from "../Atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
 
  const showToast = useShowToast()
  const [loading , setLoading] = useState(true)
  const [conversations , setConversations] = useRecoilState(conversationAtom)
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [searchText , setSearchText] = useState("")
  const[searching , setSearching] = useState(false)
  const loggedUser = useRecoilValue(userAtom)
  const {socket , onlineUsers} = useSocket()


  useEffect(()=>{
    const getConversations = async()=>{
      try {
        const res = await fetch('api/messages' , {
          method:"GET"
        })
        const data = await res.json()
        if(!data.success){
          showToast(data.message , 'error')
          return
        }
        // console.log(data);
        setConversations(data.conversations)
      } catch (error) {
        showToast(error.message , 'error')
      }finally{
        setLoading(false)
      }
    }
    getConversations()
  },[showToast ])

  const handleConversationSearch = async(e)=>{
    e.preventDefault()
    setSearching(true)
    try {
      const res = await fetch(`/api/users/profile/${searchText}`)
      const user = await res.json()
      if(!user.success){
        showToast(user.message , 'error')
      }
      //console.log(user);
      const messagingYourself = user?.user._id === loggedUser?._id
      if(messagingYourself){
        showToast("Youw cannot send message to yourself" , 'error')
      }

      const conversationAlreadyExist = conversations.find(conversation => conversation?.participants[0]._id === user?.user._id)
      if(conversationAlreadyExist){
        setSelectedConversation({
          _id:conversations.find(conversation => conversation?.participants[0]._id === user?.user._id)._id,
          userId:user?.user._id,
          avatar:user?.user.avatar,
          username:user?.user.username,
          name:user?.user.name,
        })
      }
      const fakeConversation = {
        fake:true,
        lastMessage:{
          text:"",
          sender:""
        },
        _id:Date.now(),
        participants:[
          {
            _id:user.user._id,
            username:user.user.username,
            avatar:user.user.avatar
          }
        ]
      }
      setConversations((prevConversation) => [...prevConversation , fakeConversation])
      setSearchText("")
    } catch (error) {
      showToast(error.message , 'error')
    }finally{
      setSearching(false)
    }
  }

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%)"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      p={4}
    >
      <Flex gap={5} flexDirection={{ base: "column", md: "row" }}>
        <Flex flex={30} flexDirection={"column"}>
          <Text color={useColorModeValue("gray.600", "gray.400")}>
            Your conversation
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex gap={2} alignItems={"center"}>
              <Input value={searchText} placeholder="search for user" onChange={(e)=>setSearchText(e.target.value)} />
              <Button size={"md"} cursor={'pointer'} onClick={handleConversationSearch} isLoading={searching}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loading ?
            [...Array(6)].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"12"} />
                </Box>
                <Flex
                  flexDirection={"column"}
                  gap={3}
                  justifyContent={"center"}
                  w={"full"}
                >
                  <Skeleton w={"80px"} h={"10px"} />
                  <Skeleton w={"90%"} h={"10px"} />
                </Flex>
              </Flex>
            )) : conversations.map(conversation => (
              <Conversation key={conversation._id} conversation={conversation} 
              isOnline={onlineUsers.includes(conversation.participants[0]._id)}
              />
            ))}
        </Flex>
       {!selectedConversation._id && <Flex flex={70} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <BiSolidChat size={'64'} />
            <Text color={useColorModeValue("gray.600", "gray.400")}>Start you conversation now...</Text>
        </Flex>}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
