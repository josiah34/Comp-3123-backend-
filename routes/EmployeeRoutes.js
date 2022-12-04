const employeeModel = require('../models/EmployeesModel')
const express = require('express')
const routes = express.Router()
const userRoutes = require('./UserRoutes')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const checkAuth = require('../middleware/check-auth')

//Josiah Galloway 101296257

// sample employee payload


// {
//     "firstName": "Josiah",
//     "lastName": "G",
//     "email": "something@mail.com",
//     "gender": "Male",
//     "salary": 100000
// }
routes.post('/employees', checkAuth, async(req, res) => {
    const newEmployee = new employeeModel(req.body)
    try{
        await newEmployee.save()
        res.status(201).send(newEmployee)
    }catch(err){
        res.status(500).json({message: err.message})
    }

})


routes.get('/employees' , checkAuth, async(req, res) => {
    try{
        const employees = await employeeModel.find()
        res.status(200).json(employees)
    }catch(error){
        res.status(500).json({message: error.message})
    }

})

routes.get('/employees/:id', checkAuth, async(req, res) => {
    try {
        const getEmployee = await employeeModel.findById(req.params.id, req.body)
        res.send(getEmployee)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}
)

routes.put('/employees/:id',  checkAuth, async(req, res) => {
    try {
        const updateEmployee = await employeeModel.findByIdAndUpdate(req.params.id, req.body)
        res.send(updateEmployee)
    }
       catch(error){
           res.status(500).json({message: error.message})}

})

routes.delete('/employees',  checkAuth, async(req, res) => {
    try {
        const deleteEmployee = await employeeModel.findByIdAndDelete(req.query.id, req.body)
        res.status(204).json({"message" : "Employee deleted"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }

})

module.exports = routes