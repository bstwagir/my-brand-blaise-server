const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
let mongoose = require("mongoose");
let User = require('../models/User');
const { expect } = require("chai");
const { response } = require("../index");
const should = chai.should();

//Assertion Style

chai.should();
chai.use(chaiHttp);

describe('Authorisation API', ()=>{
  let user = {
    name: "Test User",
    email: "testuser@example.com",
    password: "testpassword",
    isAdmin: false
  };


        /**
     * Test the POST route
     */
        describe("POST /server/auth/signup", () => {
            it("it should CREATE a new user", (done) => {
              const user = {
                name: "presentation",
                email: "maze@gmail.com",
                password:"12345",
              };
              chai
                .request(server)
                .post("/server/auth/signup")
                .send(user)
                .then((err, response) => {
                  expect(response.status).to.equal(200);
                  response.body.should.be.a('string');
                  res.body.should.equal('User successfully created');
                  
                });
                done(); 
            });
            it("it should NOT CREATE a new user without email", (done) => {
              const user = {
                name: "presentation",
                isAdmin : true,
                password:"12345",
              };
              chai
                .request(server)
                .post("/server/auth/signup")
                .send({email: user.email, password: user.password})
        .end((err, res) => {
          res.should.have.status(500);
          done();
        });
    });
          describe("POST /server/auth/login", () => {
            it("it should login a user", (done) => {
              const user = {
                "email": "desire@gmail.com",
                "password":"12345"
              };
              chai
                .request(server)
                .post("/server/auth/login")
                .send(user)
                .then((err, response) => {
                response.should.have.status(200);
                expect(response).to.be.a("object");
                response.header.should.have.property("accessToken");
              
            })
            

                done()
            })
    });
          it("it should NOT LOGIN a new user without email", (done) => {
              const user = {
                email: "",
                password:"technology",
              };
              chai
                .request(server)
                .post("/server/auth/login")
                .send({email: 'invaliduser@example.com', password: 'invalidpassword'})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('string');
          res.body.should.equal('Wrong credentials!');
          done();
        });
    });
  
            it("it should NOT LOGIN a new user with wrong credentials", (done) => {
              const user = {
                email: "ne@gmail.com",
                password:"12",
              };
              chai
                .request(server)
                .post("/server/auth/login")
                .send(user)
                .then((err, response) => {
                  response.should.have.status(400);
                  expect(response).to.be.a("object");
                });
              done();
            });
          });

        });
     

    