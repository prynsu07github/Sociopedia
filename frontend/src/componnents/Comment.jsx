import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Actions from "./Actions";

const Comment = ({username , avatar , comment , likes , createdAt}) => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex py={2} w={'full'} gap={4}>
        <Avatar name="Priyanshu Singh" src={avatar} size={"sm"} />
        <Flex w={'full'} flexDirection={'column'} gap={1}>
            <Flex w={'full'} justifyContent={'space-between'}alignItems={'center'}>
                <Text fontSize={'md'} fontWeight={'bold'}>{username}</Text>
                <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} fontSize={'sm'}>{createdAt}d</Text>
                    <BsThreeDotsVertical />
                </Flex>
            </Flex>
            <Text fontSize={'md'}>{comment}</Text>
            <Actions liked={liked} setLiked={setLiked} />
            <Text fontSize={'md'} color={'gray.light'}>{likes + (liked ? 1 : 0)} likes</Text>
        </Flex>
      </Flex>
      <Divider my={4} />
    </>
  );
};

export default Comment;
