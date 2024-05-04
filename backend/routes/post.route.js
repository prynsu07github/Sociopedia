import express from 'express'
import isAuthenticatedUser from '../middleware/Auth.js'
import { createPost, deletePost, getFeedPost, getPost, getUserPosts, likeUnlikePost, replyToPost } from '../controller/post.controller.js'

const router = express.Router()

router.get('/feed' , isAuthenticatedUser , getFeedPost)
router.get('/:id' , getPost)
router.get('/user/:username' , getUserPosts)
router.post('/create' , isAuthenticatedUser , createPost)
router.delete('/:id' ,isAuthenticatedUser, deletePost)
router.put('/like/:id' , isAuthenticatedUser , likeUnlikePost)
router.put('/reply/:id' , isAuthenticatedUser , replyToPost)

export default router