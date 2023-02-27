const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { postSchema } = require('../helpers/validateSchema');
const Like = require('./../models/Like');
const mongoose = require("mongoose");
const path = require("path");



/**
 * @swagger
 * components:
 *    
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - userId
 *         - content
 *         - categories
 *
 *          
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The post title
 *         userId:
 *           type: string
 *           description: The post creator
 *         content:
 *           type: string
 *           description: The post content
 *         categories:
 *           type: string
 *           description: The post category
 *         image:
 *           type: string
 *           description: The post 
 * 
 *       example:         
 *         title: The Future under AI
 *         userId: Blaise Pascal
 *         content: kldgjkdmhttjt
 *         categories: Blaise
 *
 */

  // CLOUDINARY INTEGRATION

cloudinary.config({
  cloud_name: "dlyldlpwa",
  api_key: "864224442464371",
  api_secret: "77Gf2FiXWs2cpVhdo6KvbgzwOww",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage: storage })

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader;

    jwt.verify(token, "mySecretKey", (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!, Please login");
  }
};


/**
 * @swagger
 * /server/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The post was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */

//CREATE POST
router.post("/", verify, async (req, res) => {


  const newPost = new Post({
    userId: req.user.userId,
    title: req.body.title,
    categories: req.body.categories,
    content: req.body.content,
    comments: req.body.comments,
    image: req.body.image,
  });
if (req.user.isAdmin) {
  try {

    const result = await postSchema.validateAsync(req.body);

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    if (err.isJoi == true){ res.status = 422; res.json(err.message)}
  }}else {
    res.status(500).json("Access Denied");
  }
});

//UPDATE POST

/**
 * @swagger
 * server/posts/{id}:
 *  put:
 *    summary: Update the post by the id
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: The post was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/post'
 *      404:
 *        description: The post was not found
 *      500:
 *        description: Some error happened
 */


router.put("/:id", verify, async (req, res) => {
  
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.user.userId || req.user.isAdmin) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});


//DELETE POST

/**
 * @swagger
 * server/posts/{id}:
 *   delete:
 *     summary: Remove the post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post's id
 * 
 *     responses:
 *       200:
 *         description: The post was deleted
 *       404:
 *         description: The post was not found
 */


router.delete("/:id", verify, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.user.userId || req.user.isAdmin) {
      try {
        await post.delete();
        res.status(200).json("Post has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * @swagger
 * /server/posts/{id}:
 *   get:
 *     summary: Get the post by id
 *     tags: [Posts]
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *     responses:
 *       200:
 *         description: The post description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: The post was not found
 */

//GET POST A SINGLE POST

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});



/**
 * @swagger
 * /server/posts:
 *   get:
 *     summary: Returns the list of all the posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */



//GET ALL POSTS
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const catName = req.query.cat;
  try {
    let posts;
    if (userId) {
      posts = await Post.find({ userId});
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});


//TOOGLE LIKE

/**
 * @swagger
 * components:
 *    
 *   schemas:
 *     Like:
 *       type: object
 *       required:
 *         - postId
 *         - userId
    
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the like
 *         postId:
 *           type: string
 *           description: The post id
 *         userId:
 *           type: string
 *           description: The creator id
 */



/**
 * @swagger
 * /server/posts/{postId}/toogle_like:
 *   post:
 *     summary: toogles a like for a post by id 
 *     tags: [Likes]
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *     responses:
 *       200:
 *         description: like a post by its id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 */
router.post("/:postId/toogle_like", verify, async (req, res) => {
  
    let postId=req.params.postId;
    if(!mongoose.Types.ObjectId.isValid(postId)){
      return res.status(400).send({
          message:'Invalid blog id',
          data:{}
        });
    }
  
    Post.findOne({_id:postId}).then(async(blog)=>{
      if(!blog){
        return res.status(400).send({
            message:'No blog found',
            data:{}
          });
      }else{
        let current_user=req.user;
  
        Like.findOne({
          postId : postId,
          userId:current_user.userId
        }).then(async (blog_like)=>{
          try{
            if(!blog_like){
              let blogLikeDoc=new Like({
                postId : postId,
                userId : current_user.userId
              });
              let likeData=await blogLikeDoc.save();
              await Post.updateOne({
                _id:postId
              },{
                $push:{likes:likeData._id}
              })
              return res.status(200).send({
                  message:'Like successfully added',
                  data:{}
                });
  
            }else{
  
              await Like.deleteOne({
                _id:blog_like._id
              });
  
              await Post.updateOne({
                _id:blog_like.postId
              },{
                $pull:{likes:blog_like._id}
              })
  
              return res.status(200).send({
                  message:'Like successfully removed',
                  data:{}
                });
  
  
            }
          }catch(err){
            return res.status(400).send({
                message:err.message,
                data:err
              });
          }
  
        }).catch((err)=>{
          return res.status(400).send({
              message:err.message,
              data:err
            });
        })
  
      }
    }).catch((err)=>{
      return res.status(400).send({
          message:err.message,
          data:err
        });
    })
   })
 


module.exports = router;