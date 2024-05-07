import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

const Comment = ({username , avatar , comment }) => {
  return (
    <>
      <Flex py={2} w={'full'} gap={4}>
        <Avatar name="Priyanshu Singh" src={avatar} size={"sm"} />
        <Flex w={'full'} flexDirection={'column'} gap={1}>
            <Flex w={'full'} justifyContent={'space-between'}alignItems={'center'}>
                <Text fontSize={'md'} fontWeight={'bold'}>{username}</Text>
                {/* <Flex gap={2} alignItems={'center'}>
                    <Text color={'gray.light'} fontSize={'sm'}>ago</Text>
                </Flex> */}
            </Flex>
            <Text fontSize={'md'}>{comment}</Text>
        </Flex>
      </Flex>
      <Divider my={4} />
    </>
  );
};

export default Comment;
