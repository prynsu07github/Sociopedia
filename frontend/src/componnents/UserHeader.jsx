/* eslint-disable react/no-unescaped-entities */
import {
  useToast,
  VStack,
  Flex,
  Box,
  Text,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuList, Portal, MenuItem } from "@chakra-ui/react";
import { useRef, useState } from "react";
import {  useRecoilValue } from "recoil";
import userAtom from "../Atoms/userAtom";
import { Link } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import postAtom from '../Atoms/postAtom'

const UserHeader = ({ user }) => {
  const userPost = useRecoilValue(postAtom)
  //console.log(userPost);
  const { name, username, avatar, bio, followers } = user;
  const showToast = useShowToast();
  const loggedUser = useRecoilValue(userAtom);
  const toast = useToast();
  const toastIdRef = useRef();
  const [following, setFollowing] = useState(
    user?.followers.includes(loggedUser?._id)
  );
  const [loading, setLoading] = useState(false);
  const copyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    toastIdRef.current = toast({
      description: "Copied to clipboard",
      duration: 2000,
    });
  };

  const handleFollow = async () => {
    if(!user) return showToast("You must be logged in to Like/Unlike the post" , 'error')
    setLoading(!loading);
    try {
      const res = await fetch(`/api/users/follow/${user?._id}`, {
        method: "GET",
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message, "error");
        return;
      }
      if (following) {
        user.followers.pop();
      } else {
        user.followers.push(loggedUser?._id);
      }
      showToast(data.message, "success");
      setFollowing(!following);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontWeight={"bold"} fontSize={"2xl"}>
            {name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{username}</Text>
            {/* <Text fontSize={"sm"} p={1} bg={"gray.dark"} color={"gray.light"}>
              sociopedia.net
            </Text> */}
          </Flex>
        </Box>
        <Box>
          <Avatar name={name} src={avatar} size={{ base: "lg", md: "xl" }} />
        </Box>
      </Flex>
      <Text>{bio}</Text>
      {user?._id === loggedUser?._id ? (
        <Link to="/update">
          <Button>Update Profile</Button>
        </Link>
      ) : (
        <Button
          onClick={handleFollow}
          bg={following ? "gray.dark" : "blue.500"}
          isLoading={loading}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{followers.length} followers</Text>
          <Box h={1} w={1} borderRadius={"full"} bg={"gray.light"}></Box>
            <Text color={"gray.light"}>{userPost.length} Posts</Text>
        </Flex>
        <Flex gap={2}>
          <Box className="icon-container">
            <Link href="/">
              <BsInstagram size={24} cursor={"pointer"} />
            </Link>
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy Link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={2}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex>
        {/* <Flex
          flex={1}
          borderBottom={"1.5px solid gray"}
          justifyContent={"center"}
          pb={2}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"} color={"gray.light"}>
            Replies
          </Text>
        </Flex> */}
      </Flex>
    </VStack>
  );
};

export default UserHeader;
