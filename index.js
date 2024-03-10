const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://man:EJNtwDGudh6cNHV8@cluster1.lu3ae5u.mongodb.net/userdb?retryWrites=true&w=majority")


const express=require("express");
const app=express();
const nocache = require('nocache');



// app.use(nocache());
app.use((req,res,next)=>{
  res.set('Cache-control','no-store,no-cache');
  next();
});

//for user route
const userRoute = require('./routes/userRoute');
app.use('/',userRoute)

const adminRoute = require('./routes/adminRoute');
app.use('/admin',adminRoute)

app.listen(3000, () => {
    console.log("Listening to the server on http://localhost:3000/welcomepage");
  });
    