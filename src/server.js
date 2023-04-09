// for use dotenv
require('dotenv').config()

/* SERVER STARTING */
const app = require('./app')
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})

/* DATABASE CONNECTION */
const mongoose = require('mongoose')
const db = mongoose.connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log("connected the db");
}).catch(err => {
    console.log(err)
})
