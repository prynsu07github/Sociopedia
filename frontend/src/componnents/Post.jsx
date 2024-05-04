import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../Atoms/userAtom";
import postAtom from "../Atoms/postAtom";

const Post = ({ post, postedBy }) => {

  const loggedUser = useRecoilValue(userAtom)
  const [userPosts, setUserPosts] = useRecoilState(postAtom);
  const [user, setUser] = useState({});

  const showToast = useShowToast();
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`/api/users/profile/${postedBy}`);
      const data = await res.json();
      if (!data.success) {
        showToast(data.message, "error");
        return;
      }
      setUser(data.user);
    };
    getUser();
  }, [showToast]);

  const handleDelete = async(e)=>{
    e.preventDefault()
    try {
      const res = await fetch(`/api/posts/${post._id}` , {
        method:"DELETE"
      })
      const data = await res.json()
      if(!data.success){
        showToast(data.message ,'error')
      }
      showToast(data.message ,'success')
      setUserPosts(userPosts.filter(p => p._id !== post._id))
    } catch (error) {
      showToast(error.message , 'error')
    }
  }
  return (
    <Link to={`/${user?.username}/post/${post?._id}`}>
      <Flex gap={5} mb={10} py={5}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            name={user?.name}
            src={user?.avatar}
            size={{ base: "md", md: "lg" }}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" bg={"gray.light"} h={"full"} mt={2}></Box>
          <Box position={"relative"} w={"full"} h={"auto"} textAlign={"center"}>
            {post?.replies.length === 0 && "😉"}
            {post?.replies[0] && (
              <Avatar
                name="Kent Dodds"
                src={post.replies[0].userAvatar}
                size={"xs"}
                position={"absolute"}
                top={"0px"}
                right={"35px"}
              />
            )}
            {post?.replies[1] && (
              <Avatar
                name="Dan Abrahmov"
                src={post.replies[1].userAvatar}
                size={"xs"}
                position={"absolute"}
                top={"0px"}
                right={"20px"}
              />
            )}
            {post?.replies[2] && (
              <Avatar
                name="Segun Adebayo"
                src={post.replies[2].userAvatar}
                size={"xs"}
                position={"absolute"}
                top={"0"}
                right={"5px"}
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontWeight={"bold"}
                fontSize={"sm"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
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
            <Flex alignItems={"center"} gap={4}>
              <Text color={"gray.light"} w={36} textAlign={"right"}>
                {formatDistanceToNow(new Date(post?.createdAt))} ago
              </Text>
            {loggedUser?._id === post?.postedBy && <DeleteIcon onClick={handleDelete} />}
            </Flex>
          </Flex>
          <Text fontSize={"sm"}>{post.text}</Text>
          {post.image && (
            <Box
              borderRadius={5}
              border={"1px solid"}
              borderColor={"gray.light"}
              overflow={"hidden"}
            >
              <Flex
                justifyContent={"center"}
                w={"auto"}
                h={"full"}
                maxH={"350px"}
              >
                <Image
                  src={post.image}
                  alt="post-image"
                  h={"full"}
                  w={"auto"}
                />
              </Flex>
            </Box>
          )}
          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
