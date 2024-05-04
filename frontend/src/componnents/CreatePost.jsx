import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  ModalHeader,
  ModalFooter,
  Image,
  Flex,
  CloseButton,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImage from "../hooks/usePreviewImage";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import postAtom from "../Atoms/postAtom";

const CreatePost = () => {
  const [userPosts, setUserPosts] = useRecoilState(postAtom);
  const { imageUrl, setImageUrl, handleImageChange } = usePreviewImage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const imageRef = useRef();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false)
  const [postData, setPostData] = useState({
    text: "",
  });
  const handleCreatePost = async () => {
    setLoading(!loading)
    try {
      const res = await fetch('/api/posts/create' , {
        method:"POST",
        headers:{
          'Content-Type':'Application/json'
        },
        body:JSON.stringify({...postData , image:imageUrl})
      })
      const data = await res.json()
      if(!data.success){
        showToast(data.message , 'error')
        return
      }
      showToast(data.message , 'success')
      setUserPosts([data.post , ...userPosts ])
      onClose()
    } catch (error) {
      showToast(error.message, "error");
    }finally{
      setLoading(false)
    }
  };

  const cancelCreatePost = () => {
    onClose();
    setImageUrl("");
    setPostData({ ...postData, name: "" });
  };
  //console.log(imageUrl);

  return (
    <>
      <Button
        onClick={onOpen}
        position={"fixed"}
        bottom={5}
        right={5}
        leftIcon={<AddIcon />}
      >
        Post
      </Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        //    onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg={"gray.dark"}>
          <ModalHeader>Create New Post</ModalHeader>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                ref={initialRef}
                placeholder="First name"
                onChange={(e) =>
                  setPostData({ ...postData, text: e.target.value })
                }
              />
            </FormControl>

            <FormControl mt={4}>
              {/* <FormLabel>Media</FormLabel> */}
              <Button w={"full"} onClick={() => imageRef.current.click()}>
                Select Media
              </Button>
              <Input
                placeholder="Last name"
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
            </FormControl>
            {imageUrl && (
              <Flex w={"full"} position={"relative"} mt={10}>
                <CloseButton
                  bg={"gray.dark"}
                  position={"absolute"}
                  right={2}
                  top={2}
                  size={"lg"}
                  onClick={() => {
                    setImageUrl("");
                  }}
                ></CloseButton>
                <Image src={imageUrl} alt="postImage" />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
              Upload
            </Button>
            <Button onClick={cancelCreatePost} isDisabled={loading}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
