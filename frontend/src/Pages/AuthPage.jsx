import { useRecoilValue } from "recoil";
import LoginCard from "../componnents/LoginCard";
import SignupCard from "../componnents/SignupCard";
import authStateAtom from "../Atoms/authAtom";

const AuthPage = () => {
  const authState = useRecoilValue(authStateAtom);
  return <div>{authState === "login" ? <LoginCard /> : <SignupCard />}</div>;
};

export default AuthPage;
