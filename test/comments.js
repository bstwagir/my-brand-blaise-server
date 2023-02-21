const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

//Assertion Style

chai.should();
chai.use(chaiHttp);

describe('Comments API', ()=>{

  /**
     * Test the GET route
     */

  describe("/GET /server/posts/comments", ()=>{
    it("It should GET all the comments", (done)=>{
        chai.request(server)
            .get("/server/posts/comments")
            .end((err,response) => {
                response.should.have.status(500);
                //response.body.should.be.a('array');                 
            })
            done();
        })
})

     /**
     * Test the POST route
     */
     
         /**
     * Test the DELETE route
     */
  /**  describe("DELETE /server/posts/:postId/comments/:id", ()=>{
      it("It should DELETE a single comment by its id", (done)=>{
          const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";

          chai.request(server)
              .delete("/server/posts/:postId/comments/:id")
              .set({ authorization: `Bearer ${token}` })
              .end((err,response) => {
                  response.should.have.status(200);
                  //response.should.have.property("name");
                
              })
             done();
          }) 
          
          
      })*/
    })