"use strict";
/*
  Name: Sadie Korzekwa
  Date: 11.01.2025
  CSC 372-01

  This is the script for the index for Assignment 7. It displays random jokes saved in a postgres server on load. 
  You can view/search for the joke categories and view the jokes in those categories. You can also add jokes to the database.

*/

(function () {
    const MY_SERVER_BASEURL = "/jokebook";
    const homeButton = id("home");
    const viewButton = id('view');
    const addButton = id("add");
    window.addEventListener("load", init);
    let contentDiv = id("container");
    /**
     * The initial function that runs on page load
     */
    function init() {
        homeButton.addEventListener('click', goHome);
        viewButton.addEventListener('click', listCategories);
        addButton.addEventListener('click', addJokeForm);
        goHome();

    }

    /**
     * this function fetches the current categories, creates buttons out of them, and adds a search bar to search 
     * for a specific category
     */
    function listCategories() {
        fetch(MY_SERVER_BASEURL + "/categories")
            .then(checkStatus)
            .then((response) => {
                contentDiv.replaceChildren();
                const header = document.createElement('h2');
                header.appendChild(document.createTextNode("Categories"));
                contentDiv.appendChild(header);
                for (const item of response) {
                    let cat = document.createElement("button");
                    cat.appendChild(document.createTextNode(item.category));
                    cat.addEventListener('click', () => {
                        displayJokesInCategory(item.category);
                    })
                    contentDiv.appendChild(cat);
                }
                createSearchBar(contentDiv);

            })
            .catch((error) => {
                console.error("Error: ", error);
            });
    }

    /**
     * Creates the actual search bar for searching categories
     * @param {*} parent : the parent is an element that should hold the search bar and search button
     */
    function createSearchBar(parent) {
        let search = document.createElement("input");
        search.setAttribute("type", "search");
        search.setAttribute("id", "search-bar");
        search.setAttribute("placeholder", "Search categories...");
        parent.appendChild(search);
        let submit = document.createElement("button");
        submit.appendChild(document.createTextNode("Submit"));
        submit.addEventListener("click", () => {
            displayJokesInCategory(search.value);
            console.log(search.value);
        });
        parent.appendChild(submit);

    }

    /**
     * Creates the form for the add joke input and provides form validation
     */
    function addJokeForm() {
        let form = document.createElement("form");
        createInputLabel("Category: ", "category", form);
        createInputElement("category", form);
        createInputLabel("Setup: ", "setup", form);
        createInputElement("setup", form);
        createInputLabel("Delivery: ", "delivery", form);
        createInputElement("delivery", form);
        let submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("value", "Submit");
        submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            if(form.checkValidity()){
                createJoke(form);
            }
            else{
                alert("All values must be filled to post joke");
            }
            
        });
        form.appendChild(submitButton);



        contentDiv.replaceChildren(form);
    }

    /**
     * Makes the actual call to the POST endpoint to create the joke in the database
     * @param {*} form : this is the form that holds the joke input
     */
    function createJoke(form) {
        let params = new FormData(form);
        let jsonBody = JSON.stringify(Object.fromEntries(params));
        fetch(MY_SERVER_BASEURL + "/joke/add", {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: jsonBody
        }).then(checkStatus)
            .then((response) => {
                contentDiv.replaceChildren();
                if (response.length === 0) {
                    let warning = document.createElement("p");
                    warning.appendChild(document.createTextNode("No Jokes found for this category"));
                    contentDiv.appendChild(warning);
                }
                else {
                    for (const joke of response) {
                        let para1 = document.createElement("p");
                        para1.appendChild(document.createTextNode(joke.setup));
                        let para2 = document.createElement("p");
                        para2.appendChild(document.createTextNode(joke.delivery));
                        contentDiv.appendChild(para1);
                        contentDiv.appendChild(para2);
                        contentDiv.appendChild(document.createElement("hr"));

                    }
                }
            }
            )

            .catch((error) => {
                console.error("Error: ", error);
            });

    }

    /**
     * Creates a label for an input field
     * @param {*} value : the actual text to display in the label
     * @param {*} id : the ID of the input that the label should be linked with
     * @param {*} form : the form that the label should be the child of
     */
    function createInputLabel(value, id, form) {
        let label = document.createElement('label');
        label.setAttribute("for", id);
        label.appendChild(document.createTextNode(value));
        form.appendChild(label);
    }

    /**
     * Creates an input field
     * @param {*} id : the ID of the input field
     * @param {*} form : the form that the input field should be a child of
     */
    function createInputElement(id, form) {
        let categoryInput = document.createElement("input");
        categoryInput.setAttribute("type", "text");
        categoryInput.setAttribute("name", id);
        categoryInput.setAttribute("id", id);
        categoryInput.required = true;
        form.appendChild(categoryInput);
    }



    /**
     * Makes the call to the endpoint to fetch all jokes in the specified category.
     * If the returned list is empty, it provides a 'No jokes found' message.
     * @param {*} category : the category to search
     */
    function displayJokesInCategory(category) {
        contentDiv.replaceChildren();
        fetch(MY_SERVER_BASEURL + "/category/" + category)
            .then(checkStatus)
            .then((response) => {
                if (response.length === 0) {
                    let warning = document.createElement("p");
                    warning.appendChild(document.createTextNode("No Jokes found for this category"));
                    contentDiv.appendChild(warning);
                }
                else {
                    for (const joke of response) {
                        let para1 = document.createElement("p");
                        para1.appendChild(document.createTextNode(joke.setup));
                        let para2 = document.createElement("p");
                        para2.appendChild(document.createTextNode(joke.delivery));
                        contentDiv.appendChild(para1);
                        contentDiv.appendChild(para2);
                        contentDiv.appendChild(document.createElement("hr"));

                    }
                }

            })
            .catch((error) => {

                console.error("Error: ", error);
            });
    }

    /**
     * Fetches a random joke from the random endpoint and displays this joke on the home screen
     */
    function goHome() {
        fetch(MY_SERVER_BASEURL + "/random")
            .then(checkStatus)
            .then((response) => {
                let para1 = document.createElement("p");
                para1.appendChild(document.createTextNode(response.setup));
                let para2 = document.createElement("p");
                para2.appendChild(document.createTextNode(response.delivery));
                contentDiv.replaceChildren(para1, para2);
            })
            .catch((error) => {
                console.error("Error: ", error);
            });
    }
    /**
     * Just fetches the element with the specified ID
     * @param {*} idName : the ID of the element
     * @returns the element with the ID of idName
     */
    function id(idName) {
        return document.getElementById(idName);
    }

    /**
     * Checks the status of an API call
     * @param {*} response : the response from the API call
     * @returns the JSON of the response if the response is ok. Otherwise, it throws an error.
     */
    function checkStatus(response) {
        if (!response.ok) {
            throw Error("Error in request: " + response.statusText);
        }
        return response.json();
    }


})();
