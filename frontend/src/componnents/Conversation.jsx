import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import userAtom from "../Atoms/userAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../Atoms/messagesAtom";

const Conversation = ({ conversation , isOnline}) => {
  const user = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const remoteUser = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const {colorMode} = useColorMode();
  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
      }}
      borderRadius={"md"}
      onClick={() =>
        setSelectedConversation({
          _id: conversation?._id,
          userId: remoteUser?._id,
          avatar: remoteUser?.avatar,
          name: remoteUser?.name,
          username: remoteUser?.username,
          fake:conversation?.fake
        })
      }
      bg={
        selectedConversation?._id === conversation?._id ?
        (colorMode ==="light" ? "gray.400" : "gray.dark"):""
      }
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            md: "sm",
            lg: "md",
          }}
          name={remoteUser?.name}
          src={remoteUser?.avatar}
        >
         {isOnline ? <AvatarBadge boxSize="1em" bg={"green.500"} /> : ''}
        </Avatar>
      </WrapItem>
      <Stack direction={"column"} fontSize={"sm"}>
        <Text display={"flex"} alignItems={"center"} fontWeight={700}>
          {remoteUser?.username}
          <Image ml={1} w={4} h={4} src="/verified.png" alt="verified logo" />
        </Text>
        <Text
          fontSize={"xs"}
          display={"flex"}
          alignItems={"center"}
          gap={1}
          fontWeight={user._id !== lastMessage.sender && "bolder"}
        >
          {user._id === lastMessage.sender && <BsCheck2All size={"16px"} />}
          {lastMessage.text.length > 15
            ? lastMessage.text.substring(0, 15) + "..."
            : lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversation;
