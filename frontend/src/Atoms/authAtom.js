import { atom } from "recoil";

const authStateAtom = atom({
    key:"authState",
    default:"login"
})

export default authStateAtom