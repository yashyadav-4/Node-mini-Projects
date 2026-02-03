const express= require('express');
const { Url } = require('../Models/url');
const { restrictTO } = require('../middleWares/auth');

const router= express.Router();

router.get('/admin/urls' , restrictTO(["ADMIN"])  , async (req , res)=>{
    const allurls = await Url.find({})
    return res.render('home',{
        urls:allurls,
    });
});


router.get('/' , restrictTO(["NORMAL" , "ADMIN"]) , async (req , res)=>{
    const allurls = await Url.find({createdBY:req.user._id})
    return res.render('home',{
        urls:allurls,
    });
})

router.get('/signup' , (req, res)=>{
    return res.render('signup');
})
router.get('/login' , (req, res)=>{
    return res.render('login');
})
module.exports=router;