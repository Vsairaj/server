import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the bookshelf
router.get("/", async (req, res) => {
  let collection = await db.collection("bookshelf");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// This section will help you get a single record by id
router.get("/:token", async (req, res) => {
  let collection = await db.collection("bookshelf");
  let query = { user: req.params.token };
  let result = await collection.findOne(query);
  if (!result) res.status(404).send("Not found").status(404);
  else res.status(200).send(result);
});

router.post("/myBookShelf", async (req, res) => {
  let collection = await db.collection("bookshelf");
  let query = { user: req.body.user };
  let result = await collection.findOne(query);
  if (!result) res.status(404).send("Not found").status(404);
  else res.status(200).send(result);
});

const isBookAdded = (book, existingUser) => {
  const found = existingUser ? existingUser.books.findIndex((elem) => elem.id === book.id) : -1;
  console.log("found", found);
  return found > -1;
};

router.post("/createRecord", async (req, res) => {
  let query = { user: req.body.user };
  let collection = await db.collection("bookshelf");
  let existingUser = await collection.findOne(query);
  let isBookInArray = isBookAdded(req.body.book, existingUser);

  if (existingUser && isBookInArray) {
    res.status(401).send("Book is in array");
  } else if (existingUser && !isBookInArray) {
    const updates = {
      $set: {
        user: req.body.user,
        books: [...existingUser.books, req.body.book],
      },
    };

    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } else {
    let newDocument = {
      user: req.body.user,
      books: [req.body.book],
    };
    let result = await collection.insertOne(newDocument);
    res.status(200).send(result);
  }
});
router.post("/deleteRecord", async (req, res) => {
  let query = { user: req.body.user };
  let collection = await db.collection("bookshelf");
  let existingUser = await collection.findOne(query);
  const updates = {
    $set: {
      ...existingUser,
      books: existingUser.books.filter((elem) => elem.id !== req.body.book),
    },
  };
  let result = await collection.updateOne(query, updates);
  res.status(200).send(result);
});

export default router;
