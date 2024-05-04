import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useShowToast from "./useShowToast"

const useGetUserProfile = () => {
    const[user,setUser]=useState()
    const[loading , setLoading] = useState(true)
    const {username} = useParams()
    const showToast = useShowToast()
    useEffect(()=>{
        const getUserData = async () => {
            try {
              const res = await fetch(`/api/users/profile/${username}`, {
                method: "GET",
              });
              const data = await res.json();
              if (!data.success) {
                showToast(data.message, "error");
                return;
              }
              // if(data.user.isFrozen){
              //   setUser(null)
              //   return
              // }
              //console.log("user" ,data.user);
              setUser(data.user)
            } catch (error) {
              showToast(error.message, "error");
            } finally {
              setLoading(false);
            }
          };
          getUserData()
    },[username,showToast])
    return {loading , user}
}

export default useGetUserProfile