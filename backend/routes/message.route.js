import express from 'express'
import isAuthenticatedUser from '../middleware/Auth.js'
import {  getMessages, getUserConversations, sendMessage } from '../controller/message.controller.js'
const router = express.Router()

router.get('/:otherUserId' , isAuthenticatedUser , getMessages)
router.get('/', isAuthenticatedUser , getUserConversations)
router.post('/', isAuthenticatedUser , sendMessage)

export default router