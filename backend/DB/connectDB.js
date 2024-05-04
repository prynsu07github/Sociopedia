/* eslint-disable no-undef */
import mongoose from 'mongoose'

const connectDB =()=>{
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('successfully connected to database');
    }).catch((err)=>{
        console.log(err.message);
    })
}

export default connectDB