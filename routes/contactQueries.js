const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const ContactQuery = require("../models/ContactQuery");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * components:
 *    
 *   schemas:
 *     ContactQuery:
 *       type: object
 *       required:
 *         - name
 *         - subject
 *         - email
 *         - message
 *
 *          
 *       properties:
 *         name:
 *           type: string
 *           description: The auto-generated id of the message
 *         subject:
 *           type: string
 *           description: The subject of the message
 *         message:
 *           type: string
 *           description: The message sender
 *         email:
 *           description: The eamil of the sender
 * 
 * 
 *       example:         
 *         name: Blaise
 *         subject: Employment
 *         email: bstwagir@mtu.edu
 *         message: Can meet to discuss an employment position
 *
 */


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
    res.status(401).json("You are not authenticated!");
  }
};

//CREATE ContacQuery

/**
 * @swagger
 * /server/contactQueries:
 *   post:
 *     summary: Create a new contactQuery
 *     tags: [ContactQueries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactQuery'
 *     responses:
 *       200:
 *         description: The contactQuery was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactQuery'
 *       500:
 *         description: Some server error
 */

router.post("/", async (req, res) => {
    const newContactQuery = new ContactQuery(req.body);
    try {
      const savedContactQuery = await newContactQuery.save();
      res.status(200).json(savedContactQuery);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  //DELETE CONTACTQUERY

/**
 * @swagger
 * server/contactQueries/{id}:
 *   delete:
 *     summary: Remove the contactQuery by id
 *     tags: [ContactQueries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contactQuery's id
 * 
 *     responses:
 *       200:
 *         description: The contatQuery was deleted
 *       404:
 *         description: The contatQuery was not found
 */


router.delete("/:id", verify, async (req, res) => {
  try {
    const contactQuery = await ContactQuery.findById(req.params.id);
    if (req.user.isAdmin) {
      try {
        await contactQuery.delete();
        res.status(200).json("Query has been deleted...");
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


//GET ALL CONTACTQUERY

/**
 * @swagger
 * /server/contactQueries:
 *   get:
 *     summary: Returns the list of all the messages
 *     tags: [ContactQueries]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ContactQuery'
 */


router.get("/", async (req, res) => {
    try {
      const contactQueries = await ContactQuery.find();
      res.status(200).json(contactQueries);
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;