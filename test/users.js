const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
let mongoose = require("mongoose");
let User = require('../models/User');
const { expect } = require("chai");
const { response } = require("../index");

//Assertion Style

chai.should();
chai.use(chaiHttp);

describe('Users API', ()=>{

    /**
     * Test the GET route
     */

    describe("GET/server/users/", ()=>{
        it("It should GET all the users", (done)=>{
            const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
            chai.request(server)
                .get("/server/users")
                .set({ Authorization: `${token}` })
                .end((err,response) => {
                    response.should.have.status('200');
                    response.body.should.be.a('array');
                    //response.should.have.property("name")
                })
                done();
                   
            })

            it("it should not GET users without authorization", ()=>{
                const token =
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls"; 
                chai.request(server)
                .get("/server/users")
                .set({ Authorization: `401` })
                .then((err,response) => {
                    response.should.have.status('500');
                    expect(response).to.be.a("object");
                    //response.should.have.property("name")
                    done();
              })
              .catch((err) => {

                done(err)
         })
      })
    })
    /**
     * Test the GET (by id) route
     */

    describe("GET/server/users/:id", ()=>{
        it("It should GET a single user by its id", (done)=>{
            const token =
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls"; 
            chai.request(server)
                .get("/server/users/:id")
                .set({ Authorization: `${token}` })
                .then((err,response) => {
                    response.should.have.status(200);
                    expect(response).to.be.a("object");
                    //response.should.have.property("name");
                  
                })
               done();
            }) 
            it("It should not GET a single user by its id without authorization", (done)=>{
                chai.request(server)
                    .get("/server/users/:id")
                    .end((err,response) => {
                        response.should.have.status(401);
                        //response.should.not.have.property("name");
                      
                    })
                   done();
                }) 
            
            
        })
    /**
     * Test the PUT route
     */

    describe("PUT /server/users/:id", ()=>{
        it("It should UPDATE a single user by its id", (done)=>{
            const userId = "63e65080ecd0e11c138ed443";
            const user = {
                name: "Tedd",
                email: "pubnsrel@gmail.com",
                password:"echnology",
                isAdmin:false,
              };
              const token =
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
              
            chai.request(server)
                .put("/server/users/" + userId)
                .send(user)
                .set({ authorization: `${token}` })
                .then((err,response) => {
                    response.should.have.status(200);
                    expect(response).to.be.a("object");
                  
                })
               done();
            }) 
            
            it("It should not UPDATE a single user by its id without autorization", (done)=>{
                const userId = "63e65080ecd0e11c138ed443";
                
              const token =
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";

                const user = {
                    name: "Tedd",
                    email: "pubnsrel@gmail.com",
                    password:"echnology",
                    isAdmin:false,
                  };
                  chai.request(server)
                    .put("/server/users/" + userId)
                    .send(user)
                    .set({ authorization: `` })
                    .end((err,response) => {
                        response.should.have.status(401);
                        //response.should.have.property("name");
                      
                    })
                   done();
                }) 
        })


    /**
     * Test the DELETE route
     */
    describe("DELETE /server/users/:id", ()=>{
        it("It should DELETE a single user by its id", (done)=>{
            const userId = "63e65080ecd0e11c138ed443";
            const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
            chai.request(server)
                .delete("/server/users/" + userId)
                .set({ authorization: `${token}` })
                .then((err,response) => {
                    response.should.have.status(200);
                expect(response).to.be.a("object");
                  
                })
               done();
            })
            it("It should not DELETE a single user by its id", (done)=>{
                const userId = "63e65080ecd0e11c138ed443";  
            const token =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
            
                chai.request(server)
                    .delete("/server/users/63e65080ecd0e11c138ed443")
                    .set({ authorization: `bearer ${token}` })
                    .then((err,response) => {
                        response.should.have.status(403);
                        expect(response).to.be.a("object"); 
            
            
        })
        done();


    })
})
})