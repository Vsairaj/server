import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the student_data.
router.post("/", async (req, res) => {
    if (req.body.email == '' || req.body.password == '') {
        res.status(401).send({ error: "Wrong username or password" })};

  let collection = await db.collection("login_data");
  let query = {email: req.body.email};
  let result = await collection.findOne(query);
  
  if (!result) res.status(404).send(JSON.stringify("Not found"));


  else if(result.password !== req.body.password)
  {res.status(403).send(JSON.stringify("Incorrect Password"));}


  else if(result.password === req.body.password) 
  {res.send(result).status(200);}

  
});

router.post("/createAccount", async (req, res) => {
  if (req.body.email == '' || req.body.password == '') {
      res.status(401).send({ error: "Wrong username or password" })};

let collection = await db.collection("login_data");
let query = {email: req.body.email};
let result = await collection.findOne(query);

if (result) res.status(401).send(JSON.stringify("Already Exists"));


else {
  let newDocument = {
    email: req.body.email,
    password: req.body.password,
  };
  let result = await collection.insertOne(newDocument);
  res.status(200).send(result);
}

});



export default router;