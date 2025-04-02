const {nanoid}=require('nanoid')
const URL=require('../models/url')

async function handleGenerateNewShortURL(req, res){
    const shortID=nanoid(8);
    const body=req.body()
    if(!body.url)return res.status(400 ).json({error:'url is required'})
    await URL.create({
        shortId:shortID,
        redirectUrl:body.url,
        visitHistory:[],
    })
    return res.json({id:shortID})
}

module.exports={
    handleGenerateNewShortURL,
}