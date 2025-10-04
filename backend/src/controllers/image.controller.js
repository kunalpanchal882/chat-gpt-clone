const {createCaption} = require('../services/ai.service')
const postModel = require('../models/post.model')
const uploadImage = require('../services/store.service')

async function genratedcaptions(req,res) {
   const file = req.file
    
    const base64Image = Buffer.from(file.buffer).toString('base64')


    const imageCaption =await createCaption(base64Image);

    console.log(imageCaption);
    
    const imageUrl = await uploadImage(file)
  
    const user = await postModel.create({
        image:imageUrl.url,
        caption:imageCaption
    })

    res.status(201).json({
        message:"data save successfully",
        user
    })
}

module.exports = {
    genratedcaptions
}