const express = require('express')
const blogController = require('../controllers/blogControllers.js')
const router = express.Router()
const isAuthorized = require("../middlewares/authorize-check.js");
const { coverUpload, imageUpload } = require('../utils/multer.js')


/* POST */
router.post('/create', isAuthorized, blogController.createBlog)
router.post('/:blogId/commentCreate', isAuthorized, blogController.commentCreate)
router.post('/:blogId/dislike', isAuthorized, blogController.createDislike)
router.post('/:blogId/like', isAuthorized, blogController.createLike)
router.post('/uploadCover', isAuthorized, coverUpload.single('coverImg'), blogController.uploadCover)
router.post('/uploadImage', isAuthorized, imageUpload.single('blogImg'), blogController.uploadImg)

/* GET */
router.get('/images/covers/:imageName', blogController.getCover)
router.get('/images/:imageName', blogController.getImage)
router.get('/', blogController.getAllBlogs)
router.get('/most-viewed', blogController.getMostViewedFourBlogs)
router.get('/homeblogs', blogController.getHomeBlogs)
router.get('/user/:authorId', blogController.getUserBlogs)
router.get('/:blogId', blogController.getBlog)

/* PUT */
router.put('/:blogId', isAuthorized, blogController.updateBlog)
router.put('/:blogId/:commentId/commentUpdate', isAuthorized, blogController.updateComment)


/* DELETE */
router.delete('/:blogId', isAuthorized, blogController.deleteBlog)
router.delete('/:blogId/:commentId/commentDelete', isAuthorized, blogController.deleteComment)




module.exports = router


/* NOTE */
/* HOMEPAGE MOST VİEWED */
/* BLOG PAGE RECENT */