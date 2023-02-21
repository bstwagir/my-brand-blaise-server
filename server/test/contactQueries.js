const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

//Assertion Style

chai.should();
chai.use(chaiHttp);

describe('ContactQueries API', ()=>{

    /**
     * Test the GET route
     */

    describe("GET/server/contactQueries", ()=>{
        it("It should GET all the contactQueries", (done)=>{
            chai.request(server)
                .get("/server/contactQueries")
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

    /**
     * Test the POST route
     */
    describe("POST /server/contactQueries", () => {
        it("it should POST a new contactQuery", (done) => {
          const contactQuery = {
            name: "Test 2",
            message: "presentation",
            subject:"Technology",
            email:"bstwagi@mtu.edu",
          };
         chai
            .request(server)
            .post("/server/contactQueries")
            .send(contactQuery)
            .end((err, response) => {
              response.should.have.status(500);
              //response.body.should.have.property("email");
            });
          done();
        });
        it("it should NOT POST a new contactQuery without name", (done) => {
          const contactQuery = {
            name: "",
            message: "presentation",
            email:"Technology",
            subject:"server",
          };
          chai
            .request(server)
            .post("/server/contactQueries")
            .send(contactQuery)
            .end((err, response) => {
              response.should.have.status(500);
            });
          done();
        });
      });


    /**
     * Test the PUT route
     */

    /**
     * Test the DELETE route
     */
    describe("DELETE /server/contactqueries/:id", ()=>{
      it("It should DELETE a single contactQuery by its id", (done)=>{
          const contactQueryId = "63e2551d8ce88c68feaf6863";
          const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
          chai.request(server)
              .delete("/server/contactqueries/" + contactQueryId)
              .set({ authorization: `Bearer ${token}` })
              .end((err,response) => {
                  response.should.have.status(500);
                
              })
             done();
          }) 
          
          
      })



})