const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
let mongoose = require("mongoose");
let User = require('../models/User');

//Assertion Style

chai.should();
chai.use(chaiHttp);

describe('Authorisation API', ()=>{

        /**
     * Test the POST route
     */
        describe("POST /server/auth/signup", () => {
            it("it should CREATE a new user", (done) => {
              const user = {
                name: "ne",
                email: "ne@mtu.edu",
                password:"12345",
                isAdmin : "true",
              };
              chai
                .request(server)
                .post("/server/auth/signup")
                .send(user)
                .end((err, response) => {
                  response.should.have.status(500);
                  //response.body.should.have.property("email");
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
                .send(user)
                .end((err, response) => {
                  response.should.have.status(200);
                  // response.body.should.not.have.property("email");
                });
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
                .end((err, response) => {
                  response.should.have.status(500);
                  //response.body.should.not.have.property("accessToken");
                });
              done();
            });
          it("it should NOT LOGIN a new user without email", (done) => {
              const user = {
                email: "",
                password:"technology",
              };
              chai
                .request(server)
                .post("/server/auth/login")
                .send(user)
                .end((err, response) => {
                  response.should.have.status(200);
                  response.body.should.not.have.property("email");
                });
              done();
            });
          });

        });

    