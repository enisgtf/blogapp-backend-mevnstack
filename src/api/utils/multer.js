// Multer helps us to save the files we receive on file upload requests to the uploads file on the backend side.
const multer = require('multer')

/* COVER UPLOAD */
// Storage engine
const BlogCoverStorage = multer.diskStorage({
    destination: 'uploads/blogCovers/', //directory (folder) setting
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-")) // file name setting
    }
});
// Init upload
const coverUpload = multer({
    storage: BlogCoverStorage,
    // filefilter and limits are on client-side.
})


/* BLOG IMAGE UPLOAD */
// Storage engine
const BlogImageStorage = multer.diskStorage({
    destination: 'uploads/blogImages/', //directory (folder) setting
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/ /g, "-")) // file name setting
    }
});
// Init upload
const imageUpload = multer({
    storage: BlogImageStorage,
    // filefilter and limits are on client-side.
})

module.exports = { coverUpload, imageUpload }