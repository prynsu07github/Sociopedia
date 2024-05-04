/* eslint-disable no-undef */
import jwt from 'jsonwebtoken'

const generateToeknAndSetCookie =(userId , res)=>{
    const token = jwt.sign({userId} , process.env.JWT_SCERET , {
        expiresIn:"15d"
    })
    res.cookie("access_token" , token , {
        httpOnly:true,
        maxAge:15*24*60*60*1000,
        sameSite:"strict"
    })
    return token
}

export default generateToeknAndSetCookie