import { Box, Container } from "@chakra-ui/react";
import { Routes, Route , Navigate } from "react-router-dom";
import UserPage from "./Pages/UserPage";
import PostPage from "./Pages/PostPage";
import Header from "./componnents/Header";
import HomePage from "./Pages/HomePage";
import AuthPage from "./Pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./Atoms/userAtom";
import LogoutButton from "./componnents/LogoutButton";
import UpdateProfile from "./Pages/UpdateProfile";
import CreatePost from "./componnents/CreatePost";
import ChatPage from "./Pages/ChatPage";
import SettingPage from "./Pages/SettingPage";

function App() {
  const user = useRecoilValue(userAtom)
  // console.log(user);
  return (
   <Box position={'relative'} w={'full'}>
     <Container maxW="800px">
      <Header />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/update" element={user ? <UpdateProfile /> : <Navigate to="/auth" />} />
        <Route path="/:username" element={<UserPage />} />
        <Route path="/:username/post/:pid" element={<PostPage />} />
        <Route path="/chat" element={user ? <ChatPage /> : <Navigate to='/' />} />
        <Route path="/setting" element={user ? <SettingPage />: <Navigate to='/' />} />
      </Routes>
      {user && <LogoutButton />}
      {user && <CreatePost/>}
    </Container>
   </Box>
  );
}

export default App;
