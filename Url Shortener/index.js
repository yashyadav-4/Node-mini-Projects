const path = require('path');
const express= require('express');
const {connectToMongoDb}= require('./connect')

const { Url } = require('./Models/url');

const urlRoute= require('./Routes/url');
const staticRoute= require('./Routes/staticRouter');
const userRoute= require('./Routes/user');

const port=8001;
const app=express();

connectToMongoDb('mongodb://127.0.0.1:27017/short_url')
.then(()=>{
    console.log("mongodb is connected");
})
.catch(err=>console.log(err));



app.set("view engine" , "ejs");
app.set('views' , path.resolve('./views'));



app.use(express.json()); // for json objects
app.use(express.urlencoded({ extended: false })); // for forms


app.use('/url' , urlRoute);
app.use('/', staticRoute);
app.use('/user' , userRoute);

app.get('/test' , async(req , res)=>{
    const allUrls=await Url.find({});
    return res.render('home',{
        urls:allUrls,

    })
})


app.listen(port , ()=>{
    console.log("server is live at: ", port);
})