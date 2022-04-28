# Views

Hi, its me!
Hi It's also me

Home

- Book collection
- Sign up & Log in
- Club list
- Connect

Sign up - Allows visiters to create an account ✅
Sign in - Allows existing users to sign in ✅

Club list - Allows unauthenticated users to see the full list of clubs
Single club - Allows to read and post comments for registered users
CRUD club - Allows creator to edit / delete single club

Single club comment - Allows to read single comment and to delete or edit comment
CRUD club comment - Allows creator to edit single comment

Single book - Allows to read single book information and to comment on the book, add book button
Single book comment - Allows to read single comment and to delete or edit comment
CRUD book comment - Allows creator to edit single comment

Comment creation - Displays a form which allows user to submit new post

Profile - Allows us to view single user's username, picture, registered date, list of clubs, latest comments, list of added books
Profile edit - Allows user to edit user profile

## Route Handlers

GET '/' - Renders home page

GET '/authentication/sign-up' - Renders sign up page ✅
POST '/authentication/sign-up' - Handles account registration ✅

GET '/authentication/sign-in' - Renders sign in page ✅
POST '/authentication/sign-in' - Handles existing user authentication ✅

POST '/authentication/sign-out' - Handles user sign out ✅

GET '/book/comment/create' - Renders comment creation page
POST '/book/comment/create' - Handles new comment creation

GET '/club/:id' - Renders single club page
POST '/club/:id/join' - Handles join to a club

GET '/club/comment/create' - Renders comment creation page
POST '/club/comment/create' - Handles new comment creation

GET '/book/comment/:id' - Loads comment from database, renders single comment page
GET '/club/comment/:id' - Loads comment from database, renders single comment page

GET '/book/comment/:id/edit' - Loads mow from database, renders edit page
POST '/club/comment/:id/edit' - Handles edit form submission

POST '/book/comment/:id/delete' - Delete comment
POST '/club/comment/:id/delete' - Delete comment

GET '/profile/:id' - Loads user with params/id from collection, renders profile page
GET '/profile/:id/edit' - Loads user, renders edit page
POST '/profile/:id/edit' - Handles profile edit form submission

### Models

User

- name: String, required
- email: String, required
- passwordHashAndSalt: String, required
- picture: String, required
- creationDate: timestamp
- bookComments: ObjectId
- clubComments: ObjectId
- books: Ask Teachers whether these should be arrays in a User model or have their own model
- clubs: Ask Teachers whether these should be arrays in a User model or have their own model

Comments

- message: String, required, maxlength 300
- creator: required, ObjectId //of a user, should hold a referance to the user created the publication
- createdAt: Date (add timestemps option to the publicationSchema)
- updatedAt: Date (add timestemps option to the publicationSchema)

### Wishlist

- Add date formatting helper to hbs

- Like comments

- Friendship (send invite by email)

- Send an email notification to the user on friendship requests
