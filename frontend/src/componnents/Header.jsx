/* eslint-disable no-unused-vars */
import { Flex, Image, Text, useColorMode } from "@chakra-ui/react";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../Atoms/userAtom";
import { BsChatQuoteFill } from "react-icons/bs";
import { SettingsIcon } from "@chakra-ui/icons";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  return (
    <Flex
      alignItems={"center"}
      justifyContent={user ? "space-between" : "center"}
      mt={6}
      mb={12}
    >
    
      {/* <Image
        w={6}
        cursor={"pointer"}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        alt="logo"
        onClick={toggleColorMode}
      /> */}
      <Text cursor={'pointer'} color={colorMode === "dark" ? 'white' : 'black'} fontWeight={"bold"} onClick={toggleColorMode} fontSize={{base:"2xl",md:"3xl"}}>SocioPedia</Text>
      {user && (
        <Link to={"/"}>
          <AiFillHome size={25} />
        </Link>
      )}
      {user && (
        <>
          <Link to={`/${user.username}`}>
            <RxAvatar size={25} />
          </Link>
          <Link to={`/chat`}>
            <BsChatQuoteFill size={25} />
          </Link>
          <Link to={`/setting`}>
            <MdOutlineSettings size={25}/>
          </Link>
        </>
      )}
    </Flex>
  );
};

export default Header;
