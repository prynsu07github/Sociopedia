/* eslint-disable no-undef */
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './DB/connectDB.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import messageRoutes from './routes/message.route.js'
import error from './middleware/error.js'
import {v2 as cloudinary} from 'cloudinary';
import {app , server} from './socket/socket.js'  
// cloudinary.config({ 
//   cloud_name:process.env.CLOUD_NAME, 
//   api_key: process.env.API_KEY, 
//   api_secret:process.env.API_SECRET
// });
cloudinary.config({ 
  cloud_name: 'dsz1xgai4', 
  api_key: '848178917767272', 
  api_secret: 'Lms8UnhQY59HRnFYFL2cZ5M3qqw' 
});
dotenv.config()
// const app = express()
connectDB()

//middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'} , {extended:true}));
app.use(cookieParser())

//routes
app.use('/api/users' , userRoutes)
app.use('/api/posts' , postRoutes)
app.use('/api/messages' , messageRoutes)

//error handler middleware
app.use(error)


const PORT = process.env.PORT || 5000
server.listen(PORT , ()=>{console.log('server listening to port : ' + PORT);})