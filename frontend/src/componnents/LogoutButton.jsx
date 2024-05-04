import {Button } from '@chakra-ui/react'
import { useRecoilState } from 'recoil';
import userAtom from '../Atoms/userAtom';
import useShowToast from '../hooks/useShowToast';
import { IoExitOutline } from "react-icons/io5";
const LogoutButton = () => {
    const [user , setUser] = useRecoilState(userAtom)
    const showToast = useShowToast()
    const handleLogout = async()=>{
        try {
            const res = await fetch('/api/users/logout' , {
                method:"GET"
            })
            const data = await res.json()
            console.log(data);
            if(!data.success){
                showToast('Something went wrog' , 'error')
            }
            localStorage.removeItem('user-info')
            showToast(data.message , 'success')
            setUser(null)
        } catch (error) {
            console.log(error.message);
        }
    }
  return (
    <Button size={'sm'} position={'absolute'} top={10} right={5} bg={'red.500'} fontWeight={'bold'}
    _hover={{
        bg:'red.600'
    }}
    onClick={handleLogout}
    ><IoExitOutline size={16} style={{color:'white'}}/></Button>
  )
}

export default LogoutButton