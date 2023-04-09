// creating express
const express = require('express')
const app = express()

// format data in the body of incoming requests into JSON 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


// middleware function to serve files in a specific directory of the server to clients (for uploads)
const path = require('path');
app.use(express.static(path.join(__dirname, '..', 'uploads')))

// for cors errors
const cors = require('cors')
app.use(cors())


/* ROUTES */
// blog and user api routes
const blogRoutes = require('./api/routes/blogRoutes.js')
const userRoutes = require('./api/routes/userRoutes.js')
app.use('/api/v1/blogs', blogRoutes)
app.use('/api/v1/users', userRoutes)


// for unknown routes
const AppError = require('./api/utils/create-error.js')
app.all("*", (req, res, next) => {
    next(new AppError(404, 'Route not found'))
})

// error handling
const errorHandler = require('./api/middlewares/error-handler.js')
app.use(errorHandler)


/* exports */
module.exports = app
