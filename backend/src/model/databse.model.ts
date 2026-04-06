import mongoose, { model, Schema } from "mongoose";

export const User_login = new mongoose.Schema({
    email: {
        type: String,
        require : true
    },
    
})