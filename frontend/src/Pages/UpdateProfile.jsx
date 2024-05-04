import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  // HStack,
  Avatar,
  // AvatarBadge,
  // IconButton,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImage from "../hooks/usePreviewImage";
import { useRecoilState } from "recoil";
import userAtom from "../Atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfile() {
  const [ user , setUser] = useRecoilState(userAtom)
  const ref = useRef()
  const showToast = useShowToast()
  const {handleImageChange , imageUrl} = usePreviewImage()
  const [loading , setLoading] = useState(false)
  const [formData , setFormData] = useState({
    name:user.name,
    username:user.username,
    bio:user.bio,
    email:user.email,
  })
  const handleSubmit = async()=>{
    setLoading(!loading)
    try {
      const res = await fetch(`/api/users/update/${user._id}` , {
        method:"PUT",
        headers:{
          'Content-Type':'Application/json'
        },
        body:JSON.stringify({...formData , avatar:imageUrl})
      })
      const data = await res.json()
      //console.log(data);
      if(!data.success){
        showToast(data.message , 'error')
        return
      }
      showToast(data.message , 'success')
      localStorage.setItem('user-info' , JSON.stringify(data.user))
      setUser(data.user)
    } catch (error) {
      showToast(error.message , 'error')
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <Flex align={"center"} justify={"center"}>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.dark")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        mb={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
         Update Profile
        </Heading>
        <FormControl id="userName">
          <FormLabel>User Avatar</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src={imageUrl ||user.avatar ||  ""}/>
            </Center>
            <Center w="full">
              <Button w="full" onClick={()=>ref.current.click()}>Change Avatar</Button>
              <Input type="file" hidden ref={ref} onChange={handleImageChange}/>
            </Center>
          </Stack>
        </FormControl>
        <FormControl id="name" >
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={formData.name}
            onChange={(e)=>setFormData({...formData , name:e.target.value})}
          />
        </FormControl>
        <FormControl id="userName" >
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={formData.username}
            onChange={(e)=>setFormData({...formData , username:e.target.value})}
          />
        </FormControl>
        <FormControl id="email" >
          <FormLabel>Bio</FormLabel>
          <Input
            placeholder="Jai Shree Ram"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={formData.bio}
            onChange={(e)=>setFormData({...formData , bio:e.target.value})}
          />
        </FormControl>
        <FormControl id="email" >
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={formData.email}
            onChange={(e)=>setFormData({...formData , email:e.target.value})}
          />
        </FormControl>
        <FormControl id="password" >
          <FormLabel>Password</FormLabel>
          <Input
            placeholder="password"
            _placeholder={{ color: "gray.500" }}
            type="password"
            onChange={(e)=>setFormData({...formData , password:e.target.value})}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.500"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.600",
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"green.500"}
            color={"white"}
            w="full"
            _hover={{
              bg: "green.600",
            }}
            onClick={handleSubmit}
            isLoading={loading}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
