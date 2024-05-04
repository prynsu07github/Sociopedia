import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
  } from "@chakra-ui/react";
  import { useState } from "react";
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import authStateAtom from "../Atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../Atoms/userAtom";
  
  export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthState = useSetRecoilState(authStateAtom);
    const [user , setUser] = useRecoilState(userAtom)
    const showToast = useShowToast()
    const [loading , setLoading] = useState(false)
    const [formData , setFormData] = useState({
      username:"",
      password:""
    })
    const handleSubmit  = async()=>{
      setLoading(!loading)
      try {
        const res = await fetch('/api/users/login' , {
          method:"POST",
          headers:{
            'Content-type':"Application/json"
          },
          body:JSON.stringify(formData)
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
      }finally{
        setLoading(false)
      }
    }
    return (
      <Flex
        align={"center"}
        justify={"center"}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Log in
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white","gray.dark")}
            boxShadow={"lg"}
            p={8}
            w={{base:"full" , sm:"400px"}}
          >
            <Stack spacing={4}>
              <FormControl  isRequired>
                <FormLabel>Username</FormLabel>
                <Input type="text" onChange={(e)=>setFormData({...formData , username:e.target.value})}/>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? "text" : "password"} onChange={(e)=>setFormData({...formData , password:e.target.value})}/>
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Logging in"
                  size="lg"
                  bg={useColorModeValue('gray.700' , 'gray.700')}
                  color={"white"}
                  _hover={{
                    bg: useColorModeValue('gray.600' , 'gray.600'),
                  }}
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                  Log In
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Don&apos;t have an account? <Link color={"blue.400"} onClick={()=>setAuthState("signup")}>Signup</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }
  