import { Button, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState } from "recoil";
import userAtom from "../Atoms/userAtom";
const SettingPage = () => {
  const showToast = useShowToast();
  const [user , setUser] = useRecoilState(userAtom)

  const freezeAccount = async () => {
    if (window.alert("Are you sure want to freeze your account?")) return;
    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message, "error");
        return;
      }

      const logOutRes = await fetch("/api/users/logout", {
        method: "GET",
      });
      const logoutData = await logOutRes.json();
      if (!logoutData.success) {
        showToast("Something went wrog", "error");
      }
      localStorage.removeItem("user-info");
      setUser(null);
      showToast(data.message, "success");

    } catch (error) {
      showToast(error.message, "error");
    }
  };
  return (
    <>
      <Text my={1} fontWeight={"bold"}>
        Freeze your account
      </Text>
      <Text my={1} fontWeight={"bold"}>
        You can unfreeze your account by logginng in.
      </Text>
      <Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
        Freeze
      </Button>
    </>
  );
};

export default SettingPage;
