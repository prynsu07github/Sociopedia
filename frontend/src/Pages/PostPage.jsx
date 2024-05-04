import { Avatar, Box, Button, Divider, Flex } from "@chakra-ui/react";
import { Text, Image } from "@chakra-ui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import Actions from "../componnents/Actions";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from '../hooks/useGetUserProfile'
//import Post from "../componnents/Post";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();

  const { pid } = useParams();
  const [post , setPost] = useState(null)

  const showToast = useShowToast()

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`, {
          method: "GET",
        });
        const data = await res.json();
        if(!data.success){
          showToast(data.message , 'error')       
          return 
        }
        setPost(data.post)
        console.log(post);
      } catch (error) {
        showToast(error.message , 'error')
      }
    };
    getPost();
  }, [showToast]);

  return (
    <>
      <Flex flexDirection={"column"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex gap={3}>
            <Avatar
              name={user?.name}
              src={user?.avatar}
              size={{ base: "sm", md: "md" }}
            />
            <Flex w={"full"} alignItems={"center"} gap={2}>
              <Text fontWeight={"bold"} fontSize={"sm"}>
                {user?.username}
              </Text>
              <Image
                src="/verified.png"
                alt="verified-logo"
                h={4}
                w={4}
                ml={1}
              />
            </Flex>
          </Flex>
          <Flex alignItems={"center"} gap={4}>
            <Text color={"gray.light"}>1d</Text>
            <BsThreeDotsVertical />
          </Flex>
        </Flex>
        <Text fontSize={"sm"} my={3}>
         {post?.text}
        </Text>
        <Box
          borderRadius={5}
          border={"1px solid"}
          borderColor={"gray.light"}
          overflow={"hidden"}
        >
          <Flex justifyContent={"center"} w={"auto"} h={"full"} maxH={"350px"}>
           {post?.image && <Image src={post.image} alt="post-image" h={"full"} w={"auto"} />}
          </Flex>
        </Box>
        <Flex gap={3} my={1}>
          <Actions post={post} />
        </Flex>
        {/* <Post post={post} postedBy={post?.postedBy} /> */}
        <Divider my={4} />
        <Flex justifyContent={"space-between"}>
          <Flex alignItems={"center"} gap={2}>
            <Text fontSize={"2xl"}>👋</Text>
            <Text color={"gray.light"}>
              Get the app to like , reply and post
            </Text>
          </Flex>
          <Button>Get</Button>
        </Flex>
        <Divider my={4} />
       {/* {
        post?.replies.map((reply)=>(
          <Comment
          key={reply?._id}
          comment={reply.text}
          likes={200}
          createdAt="2"
          username={reply.username}
          avatar={reply.userAvatar}
        />
        ))
       } */}
      </Flex>
    </>
  );
};

export default PostPage;
