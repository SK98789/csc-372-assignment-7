/*
  Name: Sadie Korzekwa
  Date: 11.01.2025
  CSC 372-01

    This is the Joke Controller file. The methods in this file are called by the routes. They make calls to the model,
    and they catch errors to send back with different statuses.
*/

"use strict";
const model = require('../models/jokeModel');
async function fetchCategories(req, res) {
    try {
        const categories = await model.getCategories();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }   
}

async function fetchJokesByCategory(req, res) {
    const category = req.params.category;
    const limit = req.query.limit;
    if (category) {
        try {
            const jokes = await model.getByCategory(category, limit);
            if(!jokes){
                res.status(400).send("No jokes saved under this category!");
            }
            res.json(jokes);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    } else {
        res.status(400).send("Missing required category param!");
    }   
}

async function fetchRandomJoke(req, res){
    try {
        const joke = await model.getRandomJoke();
        res.json(joke);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }   
}

async function addJoke(req, res) {
    const { category, setup, delivery } = req.body; 
    if (category && setup && delivery) {
        try {
            const newJoke = await model.addJoke(category, setup, delivery);
            res.status(201).json(newJoke);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error");
        }
    } else {
        res.status(400).send("Missing required fields!");
    }
}

module.exports = {
    fetchCategories,
    fetchJokesByCategory,
    fetchRandomJoke,
    addJoke
};