/*
  Name: Sadie Korzekwa
  Date: 11.01.2025
  CSC 372-01

  These are the routes that can be used to contact the controller. 

*/
"use strict";
const jokeController = require('../controllers/jokeController');
const express = require("express");
const router = express.Router();

router.get("/categories", jokeController.fetchCategories);
router.get("/category/:category", jokeController.fetchJokesByCategory);
router.get("/random", jokeController.fetchRandomJoke);
router.post("/joke/add", jokeController.addJoke);
module.exports = router;