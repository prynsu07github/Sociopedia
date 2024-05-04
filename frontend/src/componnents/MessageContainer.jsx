/* eslint-disable no-unused-vars */
import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import conversationAtom, {
  selectedConversationAtom,
} from "../Atoms/messagesAtom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../Atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sound/notificationSound.mp3";
const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const user = useRecoilValue(userAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationAtom);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation?._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      if (!document.hasFocus()) {
        const notificationSound = new Audio(messageSound);
        notificationSound.play();
      }

      setConversations((prevConv) => {
        const updatedConversation = prevConv.map((conv) => {
          if (conv._id === message.conversationId) {
            return {
              ...conv,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conv;
        });
        return updatedConversation;
      });
    });

    return () => socket.off("newMessage");
  }, [socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.fake) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (!data.success) {
          showToast(data.message, "error");
          return;
        }
        // console.log(data);
        setMessages(data.messages);
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation]);

  return (
    <Flex
      p={2}
      flex={"70"}
      bg={useColorModeValue("gray.200", "gray.dark")}
      height={"400px"}
      borderRadius={"md"}
      flexDirection={"column"}
    >
      {/* message header */}
      <Flex w={"full"} h={"12"} alignItems={"center"} gap={2}>
        <Avatar
          name={selectedConversation?.name}
          src={selectedConversation?.avatar}
          size={"sm"}
        />
        <Text display={"flex"} alignItems={"center"} gap={1}>
          {selectedConversation?.username}
          <Image src="/verified.png" w={4} h={4} />
        </Text>
      </Flex>
      <Divider />
      <Flex
        flexDirection={"column"}
        p={2}
        gap={4}
        overflowY={"auto"}
        height={"full"}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={"7"} />}
              <Flex flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"200px"} />
                <Skeleton h={"8px"} w={"200px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={"7"} />}
            </Flex>
          ))}
        {!loadingMessages &&
          messages.map((message) => (
            <Flex
              key={message?._id}
              flexDirection={"column"}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? messageEndRef
                  : null
              }
            >
              <Message
                message={message}
                ownMessage={user?._id === message?.sender}
              />
            </Flex>
          ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
