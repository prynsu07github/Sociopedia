import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../componnents/Post";
import UserSuggestion from '../componnents/UserSuggestion'
const HomePage = () => {
  const [feedPost, setFeedPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedPost = async () => {
      try {
        setLoading(!loading);
        const res = await fetch(`/api/posts/feed`, {
          method: "GET",
        });
        const data = await res.json();
        if (!data.success) {
          showToast(data.message, "error");
          return;
        }
        setFeedPost(data.feedPosts);
        //console.log(feedPost);
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPost();
  }, [showToast]);
  return (
    <Flex gap='10' alignItems={"flex-start"}>
    <Box flex={70}>
      {loading && (
        <Flex w={"full"} justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {feedPost.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy}/>
      ))}
     </Box>
			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<UserSuggestion />
			</Box>
		</Flex>
  );
};

export default HomePage;
