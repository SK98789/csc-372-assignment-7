"use strict";


//const { response } = require("express");

(function () {
    const MY_SERVER_BASEURL = "/jokebook";
    const homeButton = id("home");
    const viewButton = id('view');
    const addButton = id("add");
    window.addEventListener("load", init);
    let contentDiv = id("container");
    function init() {
        homeButton.addEventListener('click', goHome);
        viewButton.addEventListener('click', listCategories);
        addButton.addEventListener('click', addJokeForm);
        goHome();

    }

    function listCategories() {
        fetch(MY_SERVER_BASEURL + "/categories")
            .then(checkStatus)
            .then((response) => {
                contentDiv.replaceChildren();
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
        submitButton.addEventListener('click', () => {
            createJoke(form);
        });
        form.appendChild(submitButton);



        contentDiv.replaceChildren(form);
    }

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
                console.log(response);
            }
            )

            .catch((error) => {
                console.error("Error: ", error);
            });

    }

    function createInputLabel(value, id, form) {
        let label = document.createElement('label');
        label.setAttribute("for", id);
        label.appendChild(document.createTextNode(value));
        form.appendChild(label);
    }

    function createInputElement(id, form) {
        let categoryInput = document.createElement("input");
        categoryInput.setAttribute("type", "text");
        categoryInput.setAttribute("id", id);
        form.appendChild(categoryInput);
    }



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

    function id(idName) {
        return document.getElementById(idName);
    }

    function checkStatus(response) {
        if (!response.ok) {
            throw Error("Error in request: " + response.statusText);
        }
        return response.json();
    }


})();
