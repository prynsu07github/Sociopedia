import express from 'express'
import { followAndUnfollowUser, freezeAccount, getProfile, getSuggestedUsers, login, logout, register, updateUserProfile } from '../controller/user.controller.js'
import isAuthenticatedUser from '../middleware/Auth.js'
const router = express.Router()

router.get('/profile/:query' , getProfile) //query can be userId or username
router.post('/signup' , register)
router.post('/login' , login)
router.get('/logout' , logout)
router.get('/follow/:id' ,isAuthenticatedUser , followAndUnfollowUser)
router.put('/update/:id' ,isAuthenticatedUser , updateUserProfile)
router.put('/freeze' ,isAuthenticatedUser , freezeAccount)
router.get("/suggested", isAuthenticatedUser, getSuggestedUsers);
export default router