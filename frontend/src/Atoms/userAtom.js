import { atom } from "recoil";

const userAtom = atom({
    key:"userData",
    default:JSON.parse(localStorage.getItem('user-info'))
})

export default userAtom