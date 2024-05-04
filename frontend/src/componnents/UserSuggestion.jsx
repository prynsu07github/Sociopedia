import {
  Avatar,
  Box,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Link } from "react-router-dom";

const UserSuggestion = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) {
          showToast(data.message, "error");
          return;
        }
        setSuggestedUsers(data.suggestedUsers);
      } catch (error) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, [showToast]);

  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested Users
      </Text>
      <Flex direction={"column"} gap={1}>
        {!loading &&
          suggestedUsers.map((user) => (
            <Link key={user?._id} to={`/${user?.username}`}>
              <Flex
                p={2}
                borderRadius={"md"}
                gap={1}
                alignItems={"center"}
                bg={useColorModeValue("gray.200", "gray.dark")}
              >
                <Avatar src={user?.avatar} name={user?.name} size={"sm"} />
                <Text fontSize={"sm"} fontWeight={"bold"}>
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
            </Link>
          ))}
        {loading &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={"center"}
              p={"1"}
              borderRadius={"md"}
            >
              {/* avatar skeleton */}
              <Box>
                <SkeletonCircle size={"10"} />
              </Box>
              {/* username and fullname skeleton */}
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>
              {/* follow button skeleton */}
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default UserSuggestion;
