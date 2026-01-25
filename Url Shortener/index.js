
const express= require('express');
const {connectToMongoDb}= require('./connect')
const urlRoute= require('./Routes/url');

const port=8001;
const app=express();

connectToMongoDb('mongodb://127.0.0.1:27017/short_url')
.then(()=>{
    console.log("mongodb is connected");
})
.catch(err=>console.log(err));

app.use(express.json());

app.use('/url' , urlRoute);

app.listen(port , ()=>{
    console.log("server is live at: ", port);
})