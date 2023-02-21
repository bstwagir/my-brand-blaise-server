


let mongoose = require("mongoose");
let Post = require('../models/Post');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);

describe('posts', () => {
    /**beforeEach((done) => {
        Post.remove({}, (err) => { 
           done();           
        });        
    });*/
  describe('/GET posts', () => {
      it('it should GET all the posts', (done) => {
            chai.request(server)
            .get('/server/posts')
            .end((err, res) => {
                  res.should.have.status(200);
                  //res.body.should.be.a('array');
                  //res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  describe('/POST post', () => {
      it('it should not POST a book without pages field', (done) => {
          let post = {
              title: "The Lord of the Rings",
              categories: "J.R.R. Tolkien",
              userId: 1954
          }
            chai.request(server)
            .post('/server/posts')
            .send(post)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  //res.body.should.have.property('errors');
                  //res.body.errors.should.have.property('pages');
                  //res.body.errors.pages.should.have.property('kind').eql('required');
              done();
            });
      });
      it('it should POST a book ', (done) => {
          let post = {
              title: "The Lord of the Rings",
              categories: "J.R.R. Tolkien",
              content: 1954,
              image: 1170,
              userId: "26449596"

          }
            chai.request(server)
            .post('/server/posts')
            .send(post)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  //res.body.should.have.property('message').eql('Book successfully added!');
                  res.body.book.should.have.property('title');
                  //res.body.book.should.have.property('author');
                  //res.body.book.should.have.property('pages');
                  //res.body.book.should.have.property('year');
              done();
            });
      });
  });
  describe('/GET/:id post', () => {
      it('it should GET a book by the given id', (done) => {
        let post = new Post({ title: "The Lord of the Rings", userId: "J.R.R. Tolkien", categories: 1954, content: 1170 });
              chai.request(server)
            .get('/server/posts' + post._id)
            .send(post)
            .end((err, res) => {
                  res.should.have.status(200);
                  //res.body.should.be.a('object');
                  //res.body.should.have.property('title');
                 // res.body.should.have.property('author');
                 // res.body.should.have.property('pages');
                 // res.body.should.have.property('year');
                 // res.body.should.have.property('_id').eql(book.id);
              done();
            });
          });

      });
  });
  describe('/PUT/:id book', () => {
      it('it should UPDATE a book given the id', (done) => {
          let book = new Post({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
          book.save((err, book) => {
                chai.request(server)
                .put('/server/posts/' + book.id)
                .send({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1950, pages: 778})
                .end((err, res) => {
                      res.should.have.status(200);
                    //  res.body.should.be.a('object');
                    //  res.body.should.have.property('message').eql('Book updated!');
                    //  res.body.book.should.have.property('year').eql(1950);
                  done();
                });
          });
      });
  });
 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id book', () => {
      it('it should DELETE a book given the id', (done) => {
          let book = new Post({title: "The Chronicles of Narnia", author: "C.S. Lewis", year: 1948, pages: 778})
          book.save((err, book) => {
                chai.request(server)
                .delete('/server/posts/' + book.id)
                .end((err, res) => {
                      res.should.have.status(200);
                    //  res.body.should.be.a('object');
                    //  res.body.should.have.property('message').eql('Book successfully deleted!');
                    //  res.body.result.should.have.property('ok').eql(1);
                    //  res.body.result.should.have.property('n').eql(1);
                  done();
                });
          });
      });
  });

   /** describe("/GET /server/posts/:id", ()=>{
        it("It should GET a single post by its id", (done)=>{  
          const post = new Post({ title: "The Lord of the Rings", userId: "J.R.R. Tolkien", categories: 1954, content: 1170 });        
          post.save((err, post) => {
            chai.request(server)
                .get("/server/posts" + post.id)
                .send(post)
                .end((err,response) => {
                    response.should.have.status(500);
                    response.should.have.property("title");
                  done();
                })
               done();
              })
            }) 
        })
*/

describe("POST /server/posts/:postId/comments", () => {
    it("it should POST a new comment", (done) => {
      const comment = {
        comment: "well said",
      };
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
      chai
        .request(server)
        .post("/server/posts/:postId/comments")
        .send(comment)
        .set({ authorization: `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(200);
          //response.body.should.have.property("title");
        });
      done();
    });
    it("it should NOT POST a new blog without comment", (done) => {
      const comment = {
        comment: "",
      };
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlc2lyZUBnbWFpbC5jb20iLCJpc0FkbWluIjp0cnVlLCJ1c2VySWQiOiI2M2U2NTA4MGVjZDBlMTFjMTM4ZWQ0NDMiLCJpYXQiOjE2NzYzNjY2NTZ9.del5z09kPX5W_e5PqFRr76OOFcw-YJuvFk1d3tXfAls";
      chai
        .request(server)
        .post("/server/posts/:postId/comments")
        .send(comment)
        .set({ Authorization: `Bearer ${token}` })
        .end((err, response) => {
          response.should.have.status(422);
        });
      done();
    });
  });
