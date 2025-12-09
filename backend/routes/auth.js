// // const express = require('express');
// // const User = require('../models/user.js');
// // const router = express.Router();



// // //register
// // router.post('/register', async (req,res) =>{
// //     const {username, email, password} = req.body;
// //     try {
// //         if(!username || !email || !password)
// //         {
// //             return res.status(400).json({message:"Please fill out correctly"})
// //         }
// //         const userExists = await User.findOne({email});
// //         if (userExists){
         
// //             return res.status(400).json({message:"User exists"});
           
// //         }

// //         const user= await User.create({username,email,password});
// //         res.status(201).json({
// //             id: user._id,
// //             username: user.username,
// //             email: user.email
// //         })
// //     } catch(err){
// //         res.status(500).json({message: "server error"})

// //     }


// // })

// // //login
// // router.post('/login', async (req,res) =>{
// //     const { email, password} = req.body;
// //     try {
// //         if(!email || !password)
// //         {
// //             return res.status(400).json({message:"Please fill out correctly"})
// //         }
// //         const user = await User.findOne({email});
// //         if (!user || !(await user.matchPassword(password))){
         
// //             return res.status(401).json({message:"Invalid credentials"});
           
// //         }

        
// //         res.status(201).json({
// //             id: user._id,
// //             username: user.username,
// //             email: user.email
// //         })
// //     } catch(err){
// //         res.status(500).json({message: "server error"})

// //     }


// // })

// // //
// // router.post('/me', async (req, res) => {
// //     // Here you will typically get the user ID from the request body or from a stored token
// //     const userId = req.body.userId;

// //     try {
// //         // Find the user by ID (in a real-world app, this ID might be stored in a JWT or session)
// //         const user = await User.findById(userId);
// //         if (!user) {
// //             return res.status(404).json({ message: "User not found" });
// //         }

// //         res.status(200).json({
// //             id: user._id,
// //             username: user.username,
// //             email: user.email
// //         });
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error" });
// //     }
// // });

// // module.exports = router;
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);

// export default User;

import express from 'express';  // Import express
import User from '../models/user.js';  // Import the User model (ensure the '.js' extension)

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please fill out all fields correctly" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ email, password, role });
    res.status(201).json({
      id: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill out all fields correctly" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {  // No encryption, simple password check
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Send the user ID and role after successful login
    res.status(200).json({
      id: user._id,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;  // Export the router to use in app.js
