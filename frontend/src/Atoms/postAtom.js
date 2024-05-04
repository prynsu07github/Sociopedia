import { atom } from "recoil";

const postAtom = atom({
    key:"userPosts",
    default:[]
})

export default postAtom