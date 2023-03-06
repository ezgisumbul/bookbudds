# Bookbudds

A project by: [Ezgi Sümbül](https://github.com/ezgisumbul), [Ilan Lavi](https://github.com/ilanlavi22) & [Piotr Dembinski](https://github.com/Roku013)

## Table of content

- [General Info](https://github.com/ezgisumbul/bookbudds#general-info)
- [Demo](https://github.com/ezgisumbul/bookbudds#demo)
- [Techstack](https://github.com/ezgisumbul/bookbudds#techstack)
- [Features](https://github.com/ezgisumbul/bookbudds#features)
- [Setup](https://github.com/ezgisumbul/bookbudds#setup)

## General Info

Bookbudds is a social book cataloging app. Bookbudds is a server side application using Express.js. In Bookbudds, users can create a profile, search for books they want to read, bookmark them, write reviews and edit them, create book clubs or join the clubs created by others.

## Demo

Here is a live demo : https://bookbudds.herokuapp.com/

## Techstack

JavaScript, MongoDB, Handlebars, Express.js, HTML, CSS, Google Books API, Axios, Cloudinary, Sketch


## Features
- Creating a profile
- Book search
- Bookmarking
- Writing book reviews
- Creating an joining book clubs

## Setup
#### Prerequisites: 

node.js, npm and MongoDB Compass are installed.

#### Steps:

1. Clone the repo `$ git clone https://github.com/ezgisumbul/bookbudds.git`
2. Navigate into the client directory `cd bookbudds`
3. Install the dependencies
`$ npm install`
4. Remove the .dist extension of the provided .env.dist file in the root of the project
5. [Create a Google Books API key ](https://developers.google.com/books/docs/v1/using) and update **GBOOKSKEY**
6. Set up a **SESSION_SECRET**
7. [Create a Cloudinary account](https://cloudinary.com) and [update](https://www.youtube.com/watch?v=1SIp9VL5TMo&ab_channel=Cloudinary) **CLOUDINARY_URL**

Now you are ready to run the application.

8. Run
`$ npm run dev`
