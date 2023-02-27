const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const { post } = require("../routes/posts");
const Post = require("../models/Post");
let mongoose = require("mongoose");
const { expect } = require("chai");
const { response } = require("../index");
const User = require("../models/User");

//Assertion Style

chai.should();
chai.use(chaiHttp);

describe('Posts API', ()=>{

  // Before all tests, authenticate user and create post
  before(async () => {
    const user = new User({
      username: "testuser",
      email: "testuser@example.com",
      password: "testpassword",
      isAdmin: true,
    });
    let token = "";
  let postId = "";
    const savedUser = await user.save();

    const res = await chai
      .request(server)
      .post("/auth/login")
      .send({ email: "testuser@example.com", password: "testpassword" });

    token = res.body.token;

    const post = new Post({
      userId: savedUser._id,
      title: "Test Post",
      categories: "Test Category",
      content: "Test content",
    });
    const savedPost = await post.save();

    postId = savedPost._id;
  });

  // After all tests, delete created user and post
  after(async () => {
    await User.findByIdAndDelete(token.userId);
    await Post.findByIdAndDelete(postId);
  });


  /**
   * Test chat
   */

  
  describe("POST /server/posts", () => {
    it("should create a new post", async () => {
      const res = await chai
        .request(server)
        .post("/server/posts")
        .set("Authorization", token)
        .send({
          title: "New Post",
          categories: "Category",
          content: "New content",
        });
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("title").eql("New Post");
      res.body.should.have.property("categories").eql("Category");
      res.body.should.have.property("content").eql("New content");
    });
  });

  describe("PUT /server/posts/:id", () => {
    it("should update a post by id", async () => {
      const res = await chai
        .request(server)
        .put(`/server/posts/${postId}`)
        .set("Authorization", token)
        .send({ title: "Updated Post" });
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("title").eql("Updated Post");
    });
  });

  describe("DELETE /server/posts/:id", () => {
    it("should delete a post by id", async () => {
      const res = await chai
        .request(server)
        .delete(`/server/posts/${postId}`)
        .set("Authorization", token);
      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("message").eql("Post deleted successfully!");
    });
  });
});

    /**
     * Test the GET route
     */

    describe("/GET /server/posts", ()=>{
        it("It should GET all the posts", (done)=>{
            chai.request(server)
                .get("/server/posts")
                .end((err,response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');                 
                })
                done();
            })
    })
    /**
     * Test the GET (by id) route
     */
    describe("/GET /server/posts/:id", ()=>{
        it("It should not GET a single post by its id without authorization", (done)=>{          
            chai.request(server)
                .get("/server/posts/:id")
                .end((err,response) => {
                    response.should.have.status(500);
                    //response.should.have.property("title");
                })
               done();
              })
                it("It should GET a single post by its id", (done)=>{ 
                  const postId = "63f29fd734f8f22c288669dc";
                  const token =
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";                 
                    chai.request(server)
                        .get("/server/posts/"+postId)
                        .set({ authorization: `${token}` })
                        .end((err,response) => {
                            response.should.have.status(200);
                            //response.should.have.property("title");
                        })
                       done();
                      })
            }) 
      

    /**
     * Test the POST route
     */
    describe("POST /server/posts", () => {
        it("it should POST a new blog", (done) => {
          const posts = {
            title: "Test 2",
            content: "presentation",
            categories:"Technology",
            userId:"63e65080ecd0e11c138ed443",
          };
          const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
          chai
            .request(server)
            .post("/server/posts")
            .send(posts)
            .set({ authorization: `${token}` })
            .end((err, response) => {
              response.should.have.status(200);
              //response.body.should.have.property("title");
            });
          done();
        });
        it("it should NOT POST a new blog without title", (done) => {
          const blogs = {
            title: "",
            content: "presentation",
            subject:"Technology",
            userId:"63e65080ecd0e11c138ed443",
            image: "63e35e146f5e867a7b641563",
          };
          const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
          chai
            .request(server)
            .post("/server/posts")
            .send(blogs)
            .set({ Authorization: `${token}` })
            .end((err, response) => {
              response.should.have.status(200);
            });
          done();
        });
      });


    /**
     * Test the PUT route
     */

    describe("PUT /server/posts/:id", () => {
      it("it should UPDATE a blog", (done) => {
        const postId = "63f29fd734f8f22c288669dc";
        const post = new Post({ title: "The Lord of the Rings", userId: "J.R.R. Tolkien", categories: 1954, content: 1170 });
         const posts = {
          title: "Test",
          content: "presentation",
          categories:"Technology",
          userId:"63e35e146f5e867a7b641563",
        };
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
          post.save((err, post) => {
          chai
          .request(server)
          .put("/server/posts/63f29fd734f8f22c288669dc")
          .send({ title: "The Lord of the Rings", userId: "J.R.R. Tolkien", categories: 1950, content: 1170 })
          .set({ authorization: `${token}` })
          .end((err, response) => {
            response.should.have.status(500);
            done();
          });
        
        })
      it("it should NOT UPDATE a new blog without postId", (done) => {
        const blogs = {
          content: "presentation",
          subject:"Technology",
          userId:"63e65080ecd0e11c138ed443",
        };
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
        chai
          .request(server)
          .put("/server/posts")
          .send(blogs)
          .set({ Authorization: `${token}` })
          .end((err, response) => {
            response.should.have.status(404);
          });
        done();
      });
    }); 

    /**
     * Test the DELETE route
     */
    describe("DELETE /server/posts/:id", ()=>{
      it("It should DELETE a single post by its id", (done)=>{
          const postId = "63f29fd734f8f22c288669dc";
          const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
          chai.request(server)
              .delete("/server/posts/" + postId)
              .set({ Authorization: `${token}` })
              .end((err,response) => {
                  response.should.have.status(500);                
              })
             done();
          })  
            it("It should not DELETE a single comment by its id with wrong token", (done)=>{
              const token =
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
    
              chai.request(server)
                  .delete("/server/posts")
                  .set({ authorization: `Bearer ${token}` })
                  .then((err,response) => {
                    response.should.have.status(403);
                    expect(response).to.be.a("object");
                    done();
                  })
                 done();
              }) 
              it("It should not DELETE a single comment by its id without token", (done)=>{
                const token =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
       
                chai.request(server)
                    .delete("/server/posts")
                    .set({ authorization: `` })
                    .then((err,response) => {
                      response.should.have.status(401);
                      expect(response).to.be.a("object");
                      done();
                    })
                   done();
                }) 
                it("It should not DELETE a single comment by its id if postId is invalid", (done)=>{
                  const token =
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
                  chai.request(server)
                      .delete("/server/posts/")
                      .set({ authorization: `${token}` })
                      .then((err,response) => {
                        response.should.have.status(400);
                        expect(response).to.be.a("object");
                        done();
                      })
                     done();
                  }) 
              
        })
      })
    })
