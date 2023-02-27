const router = require("express").Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post")
const mongoose=require('mongoose');
const jwt = require("jsonwebtoken")


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
 * components:
 *    
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - comment
 *       properties:
 *         comment:
 *           type: string
 *           description: The comment
 * 
 *       example:         
 *         comment: Wonderful
 *
 */



   // POST A COMMENT


/**
 * @swagger
 * /server/posts/{postId}/comments/:
 *   post:
 *     summary: Share a comment
 *     tags: [Comments]
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Some server error
 */


router.post('/:postId/comments/', verify, async (req, res) => {

let postId=req.params.postId;
	if(!mongoose.Types.ObjectId.isValid(postId)){
		return res.status(400).send({
	  		message:'Invalid blog id',
	  		data:{}
	  	});
	}
    Post.findOne({_id:postId}).then(async (blog)=>{
		if(!blog){
			return res.status(400).send({
				message:'No blog found',
				data:{}
            });}
            else{   

                try{
                    
            let newCommentDocument= new Comment({
                comment:req.body.comment,
                postId:postId,
                userId:req.user.userId
            })
            let commentData=await newCommentDocument.save();

            await Post.updateOne(
                {_id:postId},
                {
                    $push: { comments:commentData._id  } 
                }
            )
        

    return res.status(200).send({
        message: 'comment added successfully',
        data:commentData})




                }catch(err){
                    return res.status(400).send({
                          message:err.message,
                          data:err
                      });
                }

            }
    })
})

   // DELETE A COMMENT
 
/**
 * @swagger
 * /server/posts/{postId}/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The comment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The comment was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Some server error
 */


router.delete('/:postId/comments/:id', verify, async (req, res) => {

    let comment_id=req.params.id;
	if(!mongoose.Types.ObjectId.isValid(comment_id)){
		return res.status(400).send({
	  		message:'Invalid comment id',
	  		data:{}
	  	});
	}

	Comment.findOne({_id:comment_id}).then(async (comment)=>{
		if(!comment){
			return res.status(400).send({
				message:'No comment found',
				data:{}
			});	
		}else{

			let current_user=req.user;

			if(comment.userId!=current_user.userId){
				return res.status(400).send({
					message:'Access denied',
					data:{}
				});	
			}else{
				try{
					await Comment.deleteOne({_id:comment_id})
					await Post.updateOne(
						{_id:comment.postId},
						{
							$pull:{comments:comment_id}
						}
					)

					return res.status(200).send({
						message:'Comment successfully deleted',
						data:{}
					});	
				}catch(err){
					return res.status(400).send({
				  		message:err.message,
				  		data:err
				  	});
				}


				
			}

		}
	}).catch((err)=>{
		return res.status(400).send({
	  		message:err.message,
	  		data:err
	  	});
	})


})


//GET ALL COMMENTS OF A SINGLE BLOG

/**
 * @swagger
 * /server/posts/{postId}/comments:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: postId
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get("/:postId/comments", async (req, res) => {
	let postId=req.params.postId;
	if(!mongoose.Types.ObjectId.isValid(postId)){
		return res.status(400).send({
	  		message:'Invalid blog id',
	  		data:{}
	  	});
	}
    Post.findOne({_id:postId}).then(async (blog)=>{
		if(!blog){
			return res.status(400).send({
				message:'No blog found',
				data:{}
            });}
            else{   
	try {
	  const comments = await Comment.find();
	  res.status(200).json(comments);
	} catch (err) {
	  res.status(500).json(err);
	}
  };
})
})


module.exports = router;