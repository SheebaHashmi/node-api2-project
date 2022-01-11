// implement your posts router here
const Posts = require('./posts-model');
const express = require('express');
const router = express.Router()

router.get('/', async(req,res)=> {
    try{
        const post = await Posts.find()
        res.json(post)
    }
    catch{
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.get('/:id',(req,res)=> {
    Posts.findById(req.params.id)
        .then(post => {
            if(!post){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
            else{
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved" })
        })

})

router.post('/', async(req,res) => {
    try{
        const {title,contents} = req.body
        if(!title || !contents){
            res.status(400).json({ message: "Please provide title and contents for the post" })
        }
        else{
            const { id } = await Posts.insert({title,contents})
            const newPost = await Posts.findById(id)
            res.status(201).json(newPost)
        }
    }
    catch{
        res.status(500).json({ message: "There was an error while saving the post to the database" })
    }
})

router.put('/:id', async(req,res)=> {
    const {id} = req.params
    const {title,contents} = req.body
    try{
        const updatePost = await Posts.update(id,{title,contents})
        if(!updatePost){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        else if(!title || !contents){
            res.status(400).json({ message: "Please provide title and contents for the post" })
        }  
        else{
            const newPost = await Posts.findById(id) 
            res.status(201).json(newPost)
        }
        
    }
    catch{
        res.status(500).json({ message: "The post information could not be modified" })
    }
})

router.delete('/:id', async(req,res)=> {
    const {id} = req.params
    try{
        const postToDelete = await Posts.findById(id)
        if(!postToDelete){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
        else{
            console.log(postToDelete)
            res.json(postToDelete)
            await Posts.remove(id)
        }
    }
    catch{
        res.status(500).json({ message: "The post could not be removed" })
    }
})

// router.get('/:id/comments',(req,res)=> {

// })

module.exports = router