const { timeStamp } = require('console')
const mongoose=require('mongoose')


const urlSchema= new mongoose.Schema({
    shortId:{
        type:String,
        require:true,
        unique:true,
    },
    redirectUrl:{
        type:String,
        required:true,
    },
    visitHistory:[{timeStamp:{type:Number}}],
},{timestamps:true});

const URL=mongoose.model('url',urlSchema)

module.exports=URL