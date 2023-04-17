#### Review my frontend codes: https://github.com/enisgtf/blogapp-frontend-mevnstack
# Fullstack (MEVN) BlogApp
Hello! My name is Enis. I am a fullstack (MEVN) developer who is currently learning and loves to learn and improve myself.

## Application Summary:
A totally responsive blog application where users can register and write their own blogs, the most clicked ones appear on the homepage, like-dislike and comment interaction can be made to blogs, the admin authority and everything works in a reactive way and there is no need to refresh the page.



## The Purpose of the App
To create a portfolio for job application, to show as much as possible what I can do and what I am capable of.

##  What I paid attention to during the whole development?

 - Implementing the basic functions of the application completely and correctly.
 - Correctly implementing basic blog features (creation, reading, updating, deleting of posts-comments-likes) and basic user features (registration, logging in, user deletion, name-surname-username updating).
 - Use appropriate techniques to optimize the performance of the application, reduce unnecessary load times, optimize data requests and processes.
 - Paying attention to the security of the application, identifying and fixing vulnerabilities in sensitive issues such as user logins and data processing as much as possible.
 - To do as little code repetition as possible and work with best practice code.
 - Using code documentation and commenting to ensure that the code is understandable and easy to maintain.
 - Using best folder structure as much as possible.
 - Not taking shortcuts and absolutely not stopping learning.


## The stack I use in this BlogApp.

 - **M**ongoDB
 - **E**xpress.js
 -  **V**ue.js
 - **N**ode.js
 - HTML
 - SCSS

## Review my app using the live app and help me improve it!

> *https://enisgtf-mevnstack-blogapp.netlify.app/*


## Installation of the application for development

After downloading the frontend and backend side of the application from my repositories, 

front end: https://github.com/enisgtf/blogapp-frontend-mevnstack
back end: https://github.com/enisgtf/blogapp-backend-mevnstack

Type the following codes into terminals for **both** repositories:

    npm install

Afterwards

    npm run dev

These commands open the application on localhost. However, to access the backend api with axios on the frontend 
in frontend/src/main.js

    

    axios.defaults.baseURL = 'http://localhost:{ YOUR BACKEND PORT }/api/v1'

You should edit and change the url so that the port is your own backend port.


## About Backend of App
### All Technologies which I used 

 - Node.js (18.13.0)
 - Express.js (4.18.2)
 - MongoDB
 - Mongoose
 - Multer
 - JSON Web Token (JWT)
 - Bcrypt
 - Dotenv

### Folder Structure

![backend-folder-structure](https://res.cloudinary.com/dzuabw8qc/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1681081098/backend-folder-structure_pcqlno.jpg)

### What I pay attention to and care about when developing backend

 - Saved images to backend/uploads file with multer instead of saving them simply in base64 format. (cover photos to blogCovers file, images inside the blog to blogImages file)
 - Likes and comments were kept in the blog schema, thus avoiding unnecessary data exchange with the database as much as possible, and in this way, mongoose's objects and functions such as $pull, $push, $set, select, sort, sort, limit, $[elem], arrayFilters were used accurately and properly.
 - Passwords of newly created accounts were hashed and stored in the database before being sent to the database in the API. When logging in, login was done with bcrypt compare operation.
 - When a user updated their information, blogs and comments created with their old information in the old database were also edited separately. (a small but important detail!)
 - Message responses such as "Blog not found", "You don't have a permission" were given against requests to a non-existent blog or comment or against all unauthorized requests.
 - HTTP status codes such as 200, 201, 400, 404, 500 were used correctly.
 - Confidential information such as KEY was stored using the .env secret file.
 - Used express.static to serve files in a specific directory of the server to clients (for uploads)
 - Used cors for connection between localhosts while developing.
 - Created AppError class to easily generate errors during request.
 - Creating an error for routes that cannot be found.
 - Developed an error handler that sends a response according to the properties of the error.
 - Created a try-catch wrapper component to avoid code duplication during the development of each API controller.
 - Asynchronous codes were used where necessary, carefully following the syntax.
 - Blog and user schemas have been prepared carefully and in as much detail as necessary.
 - A token with a personalized payload was created during the login process and sent as a response.
 - Important information was not carried in responses against every request due to security measures. 
 - Both req.params and req.query were used.
 - Created many RESTful APIs, POST, GET, PUT, DELETE structures:
 
>     /* POST */
>     router.post('/create', isAuthorized, blogController.createBlog)
>     router.post('/:blogId/commentCreate', isAuthorized, blogController.commentCreate)
>     router.post('/:blogId/dislike', isAuthorized, blogController.createDislike)
>     router.post('/:blogId/like', isAuthorized, blogController.createLike)
>     router.post('/uploadCover', isAuthorized, coverUpload.single('coverImg'), blogController.uploadCover)
>     router.post('/uploadImage', isAuthorized, imageUpload.single('blogImg'), blogController.uploadImg)
>     router.post("/register", userController.createUser);
>     router.post("/login", userController.loginUser);
>     
>     /* GET */
>     router.get('/images/covers/:imageName', blogController.getCover)
>     router.get('/images/:imageName', blogController.getImage)
>     router.get('/', blogController.getAllBlogs)
>     router.get('/most-viewed', blogController.getMostViewedFourBlogs)
>     router.get('/homeblogs', blogController.getHomeBlogs)
>     router.get('/user/:authorId', blogController.getUserBlogs)
>     router.get('/:blogId', blogController.getBlog)
>     router.get("/:userId", userController.getUser);
>       
>     /* PUT */
>     router.put('/:blogId', isAuthorized, blogController.updateBlog)
>     router.put('/:blogId/:commentId/commentUpdate', isAuthorized, blogController.updateComment)
>     router.put("/:id", isAuthorized, userController.updateUser);
>     
>     /* DELETE */
>     router.delete('/:blogId', isAuthorized, blogController.deleteBlog)
>     router.delete('/:blogId/:commentId/commentDelete', isAuthorized, blogController.deleteComment)
>     router.delete("/:id", isAuthorized, userController.deleteUser);



## About Frontend of App
### All Technologies which I used 
 - Vue.js (3.2.45)
 - Composition API 
 - Script Setup
 - Vite
 - Pinia
 - Vue Router
 - Axios
 - SCSS
 - Vue Quill Editor
 - Quill Image Uploader
 
### Folder Structure

![frontend-folder-structure](https://res.cloudinary.com/dzuabw8qc/image/upload/c_pad,b_auto:predominant,fl_preserve_transparency/v1681080977/frontend-folder-structure_yiv6fn.jpg)

### What I pay attention to and care about when developing frontend

 - Using the Pinia store as effectively as possible.
 - Authentication and authorization process with the help of localstorage and store.
 - Routing and redirecting operations and using functions such as beforeEnter, push.
 - Collapsible desktop profile menu & mobile hamburger nav menu.
 - Component separations to ensure a better organization.
 - Sending correct file or JSON data  to backend APIs
 - Message component for UI/UX that changes color depending on the incoming response.
 - Fully reactive interface after any update. (comment, like, dislike, username...)
 - Use as complex ternary operations as possible for less code.
 - Confirm modal for careful operations like deleting a blog.
 - Testing responsiveness for each screen (min-280px). 
 - Responsive dimensions have width and height properties that can grow and shrink. (absolute width height not used)
 - Reactive css variables for responsivity. (font-size, padding-x, padding-y)
 - An edit and delete button that is visible only to comment owners or blog owners. (Admin user is authorized to delete all comments and blogs)



## Conclusion
As a result, I have learned a lot by doing this application and I will continue to learn. I will upload new projects to github as I make them. follow me! I'm very young and have a long way to go!
