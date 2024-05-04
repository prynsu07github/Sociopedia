import { Avatar, Flex, Text } from "@chakra-ui/react";
import { selectedConversationAtom } from "../Atoms/messagesAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from '../Atoms/userAtom';

const Message = ({ownMessage , message}) => {
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const user = useRecoilValue(userAtom)
  return (
    <>
     {ownMessage ? <Flex  alignSelf={'flex-end'} gap={2}>
        <Text maxW={'350px'} bg={'blue.400'}
        p={1} borderRadius={'md'}
        >
            {message?.text}
        </Text>
        <Avatar src={user?.avatar} name={user?.name} size={"sm"} />
      </Flex> : <Flex  alignSelf={'flex-start'} gap={2}>
      <Avatar src={selectedConversation?.avatar} name={selectedConversation?.name} size={"sm"} />
        <Text maxW={'350px'} bg={'green.300'}
        p={1} borderRadius={'md'}
        >
             {message?.text}
        </Text>
       
      </Flex>}
    </>
  );
};

export default Message;
