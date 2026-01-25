const shortid = require('shortid')
const { Url } = require('../Models/url');
 
async function handleGenerateNewShortUrl(req, res){
    const body=req.body;
    if(!body.url) return res.status(400).json({error:"url is required"});
    const shortId=shortid.generate();
    await Url.create({
        shortId:shortId,
        redirectUrl:body.url,
        visitHistory:[],
    });
    return res.json({id : shortId,
        "link" : "http://localhost:8001/url/" +shortId,
    });
}

async function handleReturnShortId(req, res) {
    const shortId=req.params.shortId;
    const entry = await Url.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory:{
                timestamp: Date.now(), 
            },
        }
    });
    if(!entry){
        return res.status(404).json({ error: "Short URL not found" });
    }
    res.redirect(entry.redirectUrl);
}

async function handleReturnAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await Url.findOne({ shortId });

    if (!result) return res.status(404).json({ error: "No analytics found for this ID" });

    return res.json({
        TotalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports={
    handleGenerateNewShortUrl,
    handleReturnShortId,
    handleReturnAnalytics
};