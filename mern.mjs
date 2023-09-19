import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import login_data from "./routes/login.mjs";
import bookshelf from "./routes/bookshelf.mjs";
import book_reviews from "./routes/book_reviews.mjs";

const PORT = process.env.PORT||5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/bookshelf", bookshelf);

app.use('/login', login_data);
app.use('/book_reviews_ratings', book_reviews);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


