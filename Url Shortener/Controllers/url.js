const shortid = require('shortid')
const { Url } = require('../Models/url');
 
async function handleGenerateNewShortUrl(req, res){
    const body=req.body;
    const url = body.url || body.redirectUrl; 
    console.log("Generating URL for:", url);

    if(!url) return res.status(400).json({error:"url is required"});
    
    const shortId=shortid.generate();
    console.log("Generated ShortID:", shortId); 

    try {
        const result = await Url.create({
            shortId:shortId,
            redirectUrl:url,
            visitHistory:[],
        });
        console.log("URL Created in DB:", result);
    } catch (err) {
        console.error("Error creating URL:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.render('home' , {
        id:shortId,
    })
    // return res.json({id : shortId,
    //     "link" : "http://localhost:8001/url/" +shortId,
    // });
}

async function handleReturnShortId(req, res) {
    const shortId=req.params.shortId;
    console.log("Received shortId request:", shortId); 
    
    const entry = await Url.findOneAndUpdate({
        shortId
    },{
        $push:{
            visitHistory:{
                timestamp: Date.now(), 
            },
        }
    });
    
    console.log("Database entry found for redirect:", entry); 
    if(!entry){
        const allUrls = await Url.find({}, 'shortId');
        console.log("Available ShortIDs in DB:", allUrls.map(u => u.shortId)); 
        return res.status(404).json({ error: "Short URL not found" });
    }

    let redirectUrl = entry.redirectUrl;
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
        redirectUrl = 'https://' + redirectUrl;
    }

    res.redirect(redirectUrl);
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