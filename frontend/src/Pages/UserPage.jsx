import { useEffect, useState } from "react";
import UserHeader from "../componnents/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../componnents/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postAtom from "../Atoms/postAtom";
import CreatePost from '../componnents/CreatePost'
const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  console.log(user);
  const [userPosts, setUserPosts] = useRecoilState(postAtom);
  const [isFetching, setIsFethcing] = useState(true);

  const showToast = useShowToast();

  const { username } = useParams();

  useEffect(() => {
    const getUserPosts = async () => {
      // if(!user) return 
      try {
        const res = await fetch(`/api/posts/user/${username}`, {
          method: "GET",
        });
        const data = await res.json();
        if (!data.success) {
          showToast(data.message, "error");
          return;
        }
        //console.log("user posts" , data.posts);
        setUserPosts(data.posts);
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setIsFethcing(false);
      }
    };
    getUserPosts();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex w={"full"} justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  return user? (
    <>
      <UserHeader user={user} />
      {user && <CreatePost />}
      {
      isFetching ? (
        <Flex w={"full"} justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      ) : (
        userPosts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))
      )
      }
      {!isFetching && userPosts.length === 0 && (
        <Text
          textAlign={"center"}
          mt={4}
          textColor={"gray.light"}
          fontSize={"xl"}
          fontWeight={"bold"}
        >
          User has no posts yet.
        </Text>
      )}
    </>
  ) : <h1>User not found</h1>;
};

export default UserPage;
