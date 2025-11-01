/*
  Name: Sadie Korzekwa
  Date: 11.01.2025
  CSC 372-01

  This is the joke model. It uses the database pool to make the actual queries to the
  database with the information given by the controller.

*/

const pool = require('../models/db');

/**
 * Fetches the categories stored in the DB
 * @returns a list of the categories
 */
async function getCategories() {
    const queryText = "SELECT DISTINCT category FROM jokes";
    const result = await pool.query(queryText);
    return result.rows;
}

/**
 * Gets a list of jokes by category
 * @param {*} category - only selects the jokes with this category
 * @param {*} limit - optional query parameter to limit the number of responses
 * @returns the list of jokes with the given category
 */
async function getByCategory(category, limit) {
    let queryText = "SELECT * FROM jokes where category= $1";
    let values = [category];
    if(limit){
        queryText += " LIMIT $2";
        values.push(limit);
    }
    const result = await pool.query(queryText, values);
    return result.rows;
}

/**
 * gets a random joke selected from the DB
 * @returns a random joke object
 */
async function getRandomJoke() {
    const queryText = "SELECT * FROM jokes ORDER BY RANDOM() LIMIT 1";
    const result = await pool.query(queryText);
    return result.rows[0];
}


/**
 * Creates a SQL query to insert the given values
 * @param {*} category - the category of the joke
 * @param {*} setup - the joke setup
 * @param {*} delivery - the joke delivery
 * @returns All jokes in the given category that this joke was added to
 */
async function addJoke(category, setup, delivery) {
    let queryText = "INSERT INTO jokes ( category, setup, delivery) VALUES ($1, $2, $3) RETURNING *";
    let values = [category, setup, delivery];
    const result = await pool.query(queryText, values);
    return getByCategory(category);
}
module.exports = {
    getCategories,
    getByCategory,
    getRandomJoke,
    addJoke
};