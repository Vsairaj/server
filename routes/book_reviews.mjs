import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

async function isBookAdded (book, existingUser) {

    console.log("book", book,"existingUser", existingUser);
    const found = await existingUser.books.findIndex((elem) => elem.id === book);
    //console.log("found", found);
    return found>-1;
}


router.post("/addRating", async (req, res) => {


    let queryUser = {user: req.body.user}
    let rating_collection = await db.collection("book_reviews_ratings");
    let books_collection = await db.collection("bookshelf");
    let existingUser = await books_collection.findOne(queryUser);
    let isBookInArray = await isBookAdded(req.body.book, existingUser);
    let queryRating = {user: req.body.user, book: req.body.book}
    let existingRating = await rating_collection.findOne(queryRating);

 

    if (existingUser && isBookInArray && existingRating){
      const updates =  {
        $set: {
            ...existingRating,
            rating:req.body.rating,
        }
      };
      let result = await rating_collection.updateOne(queryRating, updates);
      res.status(200).send(result);
    }
    else if (existingUser && isBookInArray)
    {
        let newDocument = {
            user: req.body.user,
            book: req.body.book,
            rating:req.body.rating,
            review_text:null,
          };
      let result = await rating_collection.insertOne(newDocument);
      res.status(200).send(result);
    }
    else {
      res.status(401).send("Either this book is not in your shelf or you are not logged in");
    }
  });

router.post("/addReview", async (req, res) => {
    let queryUser = {user: req.body.user}
    let rating_collection = await db.collection("book_reviews_ratings");
    let books_collection = await db.collection("bookshelf");
    let existingUser = await books_collection.findOne(queryUser);
    console.log("new existingUser", existingUser);
    let isBookInArray = await isBookAdded(req.body.book, existingUser);
    let queryRating = {user: req.body.user, book: req.body.book}
    let existingRating = await rating_collection.findOne(queryRating);


    if (existingUser && isBookInArray && existingRating){
      const updates =  {
        $set: {
            ...existingRating,
            review_text:req.body.review_text,
        }
      };
      let result = await rating_collection.updateOne(queryRating, updates);
      res.status(200).send(result);
    }
    else if (existingUser && isBookInArray)
    res.status(401).send("Give a rating first");
    else {
      res.status(401).send("Either this book is not in your shelf or you are not logged in");
    }
  });




router.get("/:book", async (req, res) => {

    let query = {book: req.params.book}
    let rating_collection = await db.collection("book_reviews_ratings");
    let existingRating = await rating_collection.findOne(query);
    console.log("existing", existingRating);
    if (existingRating){
      let result = await rating_collection.find(query);
      console.log("result", result);
      result= await result.toArray();
      console.log("result2", result);
      res.status(200).send(result);
    }
    else {
      console.log("error");
      res.status(401).send("This book doesn't have any reviews");
    }
  });
  export default router;


  router.delete("/:book/:user", async (req, res) => {
    const query = { book: req.params.book, user: req.params.user };  
    const rating_collection = await db.collection("book_reviews_ratings");
    let result = await rating_collection.deleteOne(query);
    res.send(result).status(200);
  });