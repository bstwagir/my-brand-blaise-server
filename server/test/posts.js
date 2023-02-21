const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const { post } = require("../routes/posts");
const Post = require("../models/Post");
let mongoose = require("mongoose");

//Assertion Style

chai.should();
chai.use(chaiHttp);

describe('Posts API', ()=>{

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
        it("It should GET a single post by its id", (done)=>{          
            chai.request(server)
                .get("/server/posts/:id")
                .end((err,response) => {
                    response.should.have.status(500);
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
            image: "63e35e146f5e867a7b641563",
          };
          const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
          chai
            .request(server)
            .post("/server/posts")
            .send(posts)
            .set({ authorization: `Bearer ${token}` })
            .end((err, response) => {
              response.should.have.status(200);
              response.body.should.have.property("title");
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
            .set({ Authorization: `Bearer ${token}` })
            .end((err, response) => {
              response.should.have.status(200);
            });
          done();
        });
      });


    /**
     * Test the PUT route
     */

    /**describe("PUT /server/posts/:id", () => {
      it("it should UPDATE a blog", (done) => {
       // const postId = "63f29fd734f8f22c288669dc";
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
          .put("/server/posts" + post.id)
          .send({ title: "The Lord of the Rings", userId: "J.R.R. Tolkien", categories: 1950, content: 1170 })
          .set({ authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(500);
            response.body.should.have.property("title");
          });
        done();
        })
      });
      it("it should NOT UPDATE a new blog without postId", (done) => {
        const blogs = {
          content: "presentation",
          subject:"Technology",
          userId:"63e65080ecd0e11c138ed443",
          image: "63e35e146f5e867a7b641563",
        };
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
        chai
          .request(server)
          .put("/server/posts")
          .send(blogs)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, response) => {
            response.should.have.status(500);
          });
        done();
      });
    }); */

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
              .set({ Authorization: `Bearer ${token}` })
              .end((err,response) => {
                  response.should.have.status(500);                
              })
             done();
          }) 
          
          
      })



})
