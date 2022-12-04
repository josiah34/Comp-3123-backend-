const userModel = require('../models/UsersModel')
const express = require('express')
const routes = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const http = require('http');
const { response } = require('express')

//Josiah Galloway 101296257

routes.post('/signup', async(req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const newUser = new userModel({username: req.body.username, email: req.body.email, password: hashedPassword})
        await newUser.save()
        res.status(201).send(newUser)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
routes.post('/login', async (req, res) => {
    const user = await userModel.find({"username": req.body.username})
    console.log(user)
    if (user == null) {
        return res.status(400).json({"status": false, "message": "Invalid username and password"})
    }
    try {
       if (await bcrypt.compare(req.body.password, user[0].password)) {
           const accessToken = jwt.sign(req.body.username, process.env.ACCESS_TOKEN_SECRET)
           res.setHeader('Authorization', 'Bearer '+ accessToken)
           res.cookie('token', accessToken, {httpOnly: true})
           res.status(200).json({"status": true, "username": req.body.username, "message": "Login successful", accessToken: accessToken})

       } else {
           res.send.json({"status": false,"message": "Invalid username and password"})
       }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



module.exports = routes