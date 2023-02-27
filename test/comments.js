const chai = require("chai");
const request = require('supertest');
const chaiHttp = require("chai-http");
const server = require("../index");
const { expect } = require("chai");
const { response } = require("../index");
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const router = require('../routes/posts');
const { JsonWebTokenError } = require("jsonwebtoken");
const jwt = require("jsonwebtoken")

//Assertion Style

chai.should();
chai.use(chaiHttp);

describe('Comments API', ()=>{
  let postId = '';
  let commentId = '';
  let token = '';

  before((done) => {
    mongoose.connect('mongodb://localhost/test_db', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
      console.log('Connected to test_db database');
      done();
    });
    const user = { userId: 'testUser' };
    token = jwt.sign(user, 'mySecretKey');

    const post = {
      title: 'Test Post',
      body: 'Test body',
    };
    const res = request(server)
      .post('/server/posts')
      .set('Authorization', token)
      .send(post);
    postId = res.body.data._id;
  });
  });

  after((done) => {
    mongoose.connection.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  describe('POST /server/posts/:postId/comments/', () => {
    it('should create a comment', (done) => {
      const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";

      const post = new Post({
        title: 'Test Post',
        content: 'Test post body',
        categories: 'technology'
      });
      post.save((err, post) => {
        if (err) {
          done(err);
        } else {
          const comment = { comment: 'Test comment' };
          request(server)
            .post(`/server/posts/${post._id}/comments/`)
            .set('Authorization',token)
            .send(comment)
            .expect(200)
            .then((res) => {
              Comment.findById(res.body.data._id, (err, comment) => {
                expect(comment.comment).to.equal('Test comment');
                expect(comment.postId).to.equal(post._id.toString());
                done();
              });
            })
            .catch((err) => done(err));
        }
      });
    });
  });

  describe('DELETE /server/posts/:postId/comments/:id', () => {
    it('should delete a comment', (done) => {
      const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";

      const comment = new Comment({
        comment: 'Test comment',
        postId: mongoose.Types.ObjectId(),
        userId: mongoose.Types.ObjectId()
      });
      comment.save((err, comment) => {
        if (err) {
          done(err);
        } else {
          request(server)
            .delete(`/server/posts/${comment.postId}/comments/${comment._id}`)
            .set('authorization',token)
            .expect(400)
            .then((res) => {
              Comment.findById(comment._id, (err, comment) => {
                expect(comment).to.be.null;
                done();
              });
            })
            .catch((err) => done(err));
        }
      });
    });
  });


  /**
     * Test the GET route
     */

  describe("/GET /server/posts/:postId/comments", ()=>{
    it("It should GET all the comments of a single blog", (done)=>{
        chai.request(server)
            .get("/server/posts/63f8788609d5fd7764663ea5/comments")
            .then((err,response) => {
                response.should.have.status(500);
                expect(response).to.be.a("object");

                
            })
            done(); 
        })
      })

     /**
     * Test the POST route
     */
     describe("POST /server/posts/:postId/comments", () => {
        it("it should POST a new comment", (done) => {
          const comments = {
            comment: "Well done",
            };
          const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
          chai
            .request(server)
            .post("/server/posts/63f8788609d5fd7764663ea5/comments")
            .send(comments)
            .set({ authorization: `${token}` })
            .then((err, response) => {
              response.should.have.status(200);
              expect(response).to.be.a("object");
            });
          done();
        });
      })
     
         /**
     * Test the DELETE route
     */
    describe("DELETE /server/posts/:postId/comments/:id", ()=>{
      it("It should DELETE a single comment by its id", (done)=>{
          const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";

          chai.request(server)
              .delete("/server/posts/63f8788609d5fd7764663ea5/comments/63f78683f280f6c969f72331")
              .set({ authorization: `${token}` })
              .then((err,response) => {
                response.should.have.status(500);
                expect(response).to.be.a("object");
                done();
              })
             done();
          }) 
          it("It should not DELETE a single comment by its id with wrong token token", (done)=>{
            const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
  
            chai.request(server)
                .delete("/server/posts/63f8788609d5fd7764663ea5/comments/63f78683f280f6c969f72331")
                .set({ authorization: `${token}` })
                .then((err,response) => {
                  response.should.have.status(403);
                  expect(response).to.be.a("object");
                  done();
                })
               done();
            }) 
            it("It should not DELETE a single comment by its id without token", (done)=>{
              
              chai.request(server)
                  .delete("/server/posts/63f8788609d5fd7764663ea5/comments/63f78683f280f6c969f72331")
                  .set({ authorization: `` })
                  .then((err,response) => {
                    response.should.have.status(401);
                    expect(response).to.be.a("object");
                    done();
                  })
                 done();
              }) 
              it("It should not DELETE a single comment by its is postId is invalid", (done)=>{
                const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
  
                chai.request(server)
                    .delete("/server/posts/63f87886/comments/63f78683f280f6c969f72331")
                    .set({ authorization: `${token}` })
                    .then((err,response) => {
                      response.should.have.status(400);
                      expect(response).to.be.a("object");
                      done();
                    })
                   done();
                }) 
            
      })
  