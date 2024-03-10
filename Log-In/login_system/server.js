const express=require('express');
const path=require('path');
const bodyparser=require("body-parser");
const session=require("express-session");
const {v4:uuid4}=require("uuid");

const router=require('./router');

const app=express();

const port=process.env.PORT||3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.set('view engine','ejs'); 

// Serve static assets from the "public" directory
app.use(express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))

app.use(session({
    secret:uuid4(),
    resave:false,
    saveUninitialized:true
}));

app.use((req,res,next)=>{
    res.set('Cache-control','no-store,no-cache')
    next()
})

app.use('/',router);



app.listen(port,()=>{
    console.log("Listening to the server on http://localhost:3000");
});