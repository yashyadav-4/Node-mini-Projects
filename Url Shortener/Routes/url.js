const express=require('express');
const {handleGenerateNewShortUrl, handleReturnShortId , handleReturnAnalytics}= require('../Controllers/url')

const router= express.Router();

router.post('/',handleGenerateNewShortUrl)

router.get('/:shortId' ,handleReturnShortId);

router.get('/analytics/:shortId',handleReturnAnalytics);

module.exports=router;