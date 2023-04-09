const Blog = require("../models/blogModel.js");
const asyncWrapper = require("../utils/trycatch-wrapper.js");
const AppError = require("../utils/create-error.js");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

/* POST */
/* this route uploads blog cover photos */
exports.uploadCover = asyncWrapper((req, res, next) => {
  res.status(201).json({
    message: "Photo is uploaded.",
    success: true,
    filename: req.file.filename,
  });
});


/* this route uploads images in blogs and returns public image url for using */
exports.uploadImg = asyncWrapper((req, res, next) => {
  const filename = req.file.filename
  const src = req.protocol + "://" + req.get("host") + req.baseUrl + "/images/" + filename;
  res.status(201).json({
    url: src
  });
});

exports.createBlog = asyncWrapper(async (req, res, next) => {
  const mainSrc =
    req.protocol + "://" + req.get("host") + req.baseUrl + "/images/covers/";
  const newBlog = req.body;
  const ownerId = req.headers.tokenData.id;

  newBlog.author = ownerId;
  newBlog.coverImgSrc = mainSrc + newBlog.coverImg; // added public cover img src from public uploads file 

  const authorData = {
    name: req.headers.tokenData.name,
    lastname: req.headers.tokenData.lastname,
    username: req.headers.tokenData.username,
  }
  newBlog.authorData = authorData
  // author information is added to the new blog.

  await Blog.create(newBlog);
  return res
    .status(201)
    .json({ message: newBlog.title + " is posted.", success: true });
});


exports.commentCreate = asyncWrapper(async (req, res, next) => {
  const blogId = req.params.blogId;
  const commentOwnerID = req.headers.tokenData.id;
  const commentOwnerUsername = req.headers.tokenData.username;
  const commentMessage = req.body.commentMessage;
  const checkBlog = await Blog.findOne({ _id: blogId });
  if (!checkBlog) {
    return next(new AppError(404, "Blog not found or deleted by owner."));
  }

  const commentID = crypto.randomBytes(12).toString("hex");

  /* the reason why I don't want it to generate _id automatically: 
  When I push the comment to blog model, the whole refreshed blog will
  be returned with {new:true} object. Then I need to find the comment 
  from the returned blog to push the newly created comment to blog.comments 
  on the client side for reactivity. For this it needs an id in advance. */

  const newComment = {
    commentOwnerID: commentOwnerID,
    commentOwnerUsername: commentOwnerUsername,
    commentMessage: commentMessage,
    commentID: commentID,
  };

  const updatedBlog = await Blog.findOneAndUpdate(
    { _id: blogId },
    { $push: { comments: newComment } },
    {
      new: true,
    }
  );

  // finding new comment for response
  const comment = updatedBlog.comments.find((com) => {
    if (com.commentID === commentID) return com;
  });

  if (!comment) {
    return res.status(400).json({ message: "Something went wrong.", success: false })
  }

  return res.status(201).json({
    message: "Comment sent successfully.",
    success: true,
    data: comment,
  });
});

exports.createLike = asyncWrapper(async (req, res, next) => {
  const blogId = req.params.blogId;
  const likedByID = req.headers.tokenData.id;
  const checkBlog = await Blog.findOne({ _id: blogId });
  if (!checkBlog) {
    return next(new AppError(404, "Blog not found or deleted by owner."));
  }
  // If the user likes while disliking, the dislike is deleted and like is added.
  const checkUserDislikes = checkBlog.dislikes.some((dislike) => {
    if ((dislike.byID = likedByID)) return true;
  });
  if (checkUserDislikes) {
    await Blog.updateOne(
      { _id: blogId },
      { $pull: { dislikes: { byID: likedByID } } }
    );
  }

  // If the user likes again while the user has liked, the previous like will be deleted.
  let allLikes = checkBlog.likes;
  const checkLikes = allLikes.some((like) => {
    if (like.byID === likedByID) return true;
  });
  if (checkLikes) {
    await Blog.updateOne(
      { _id: blogId },
      { $pull: { likes: { byID: likedByID } } }
    );
    return res
      .status(200)
      .json({ message: "Like is removed from the blog.", success: true });
  } else {
    const newLike = {
      byID: likedByID,
    };
    await Blog.updateOne({ _id: blogId }, { $push: { likes: newLike } });
    return res
      .status(201)
      .json({ message: "You liked the blog.", success: true });
  }
});

exports.createDislike = asyncWrapper(async (req, res, next) => {
  const blogId = req.params.blogId;
  const dislikedByID = req.headers.tokenData.id;
  const checkBlog = await Blog.findOne({ _id: blogId });
  if (!checkBlog) {
    return next(new AppError(404, "Blog not found or deleted by owner."));
  }
  // If the user dislikes while the user has already liked, the dislike is deleted and like is added.
  const checkUserLikes = checkBlog.likes.some((like) => {
    if ((like.byID = dislikedByID)) return true;
  });
  if (checkUserLikes) {
    await Blog.updateOne(
      { _id: blogId },
      { $pull: { likes: { byID: dislikedByID } } }
    );
  }
  // If the user dislikes again while the user has disliked, the previous dislike will be deleted.
  let allDislikes = checkBlog.dislikes;
  const checkDislikes = allDislikes.some((dislike) => {
    if (dislike.byID === dislikedByID) return true;
  });
  if (checkDislikes) {
    await Blog.updateOne(
      { _id: blogId },
      { $pull: { dislikes: { byID: dislikedByID } } }
    );
    return res
      .status(200)
      .json({ message: "Dislike is removed from the blog.", success: true });
  } else {
    const newDislike = {
      byID: dislikedByID,
    };
    await Blog.updateOne({ _id: blogId }, { $push: { dislikes: newDislike } });
    return res
      .status(201)
      .json({ message: "You disliked the blog.", success: true });
  }
});

/* GET */
exports.getCover = asyncWrapper((req, res, next) => {
  const imageName = req.params.imageName;
  const directoryPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    "blogCovers",
    imageName
  );
  fs.readFile(directoryPath, function (err, data) {
    if (err) {
      res.status(404);
    } else {
      res.end(data);
    }
  });
});
exports.getImage = asyncWrapper((req, res, next) => {
  const imageName = req.params.imageName;
  const directoryPath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    "blogImages",
    imageName
  );
  fs.readFile(directoryPath, function (err, data) {
    if (err) {
      res.status(404);
    } else {
      res.end(data);
    }
  });
});

exports.getAllBlogs = asyncWrapper(async (req, res, next) => {
  const allBlogs = await Blog.find({}).select({
    likes: 0,
    dislikes: 0,
    comments: 0,
    __v: 0,
  });
  res.status(200).json({ blogs: allBlogs, success: true });
});

exports.getMostViewedFourBlogs = asyncWrapper(async (req, res, next) => {
  const mostViewedBlogs = await Blog.find({ HomepageBlog: false || null }).sort({ viewed: -1 }).limit(4)
    .select({
      likes: 0,
      dislikes: 0,
      comments: 0,
      __v: 0,
    });
  res.status(200).json({ blogs: mostViewedBlogs, success: true });
});

exports.getHomeBlogs = asyncWrapper(async (req, res, next) => {
  const HomeBlogs = await Blog.find({ HomepageBlog: true }).select({
    likes: 0,
    dislikes: 0,
    comments: 0,
    __v: 0,
  });
  res.status(200).json({ blogs: HomeBlogs, success: true });
});

exports.getUserBlogs = asyncWrapper(async (req, res, next) => {
  const authorId = req.params.authorId;
  const userBlogs = await Blog.find({ author: authorId }).select({
    likes: 0,
    dislikes: 0,
    comments: 0,
    __v: 0,
  });
  return res.status(200).json({ data: userBlogs, success: true });
});

exports.getBlog = asyncWrapper(async (req, res, next) => {
  const blogId = req.params.blogId;
  const blog = await Blog.findOneAndUpdate(
    { _id: blogId },
    { $inc: { viewed: 1 } },
    {
      new: true,
    }
  );
  return res.status(200).json({ data: blog, success: true });
});

/* UPDATE */
exports.updateBlog = asyncWrapper(async (req, res, next) => {
  const userId = req.headers.tokenData.id;
  const blogId = req.params.blogId;
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    return next(new AppError(404, "Blog not found or deleted by owner."));
  }

  // Only the blog owner and admin can update the blog
  if (blog.author === userId || req.headers.tokenData.admin) {
    const mainSrc =
      req.protocol + "://" + req.get("host") + req.baseUrl + "/images/covers/";
    const updateBlog = req.body;
    updateBlog.coverImgSrc = mainSrc + updateBlog.coverImg
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: blogId },
      updateBlog,
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "Blog is updated.",
      success: true,
      data: { updatedBlog: updatedBlog },
    });
  } else {
    return next(new AppError(400, "You don't have permission."));
  }
});

exports.updateComment = asyncWrapper(async (req, res, next) => {
  const blogId = req.params.blogId;
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    return next(new AppError(404, "Blog not found or deleted by owner."));
  }
  const commentId = req.params.commentId;
  const newCommentMessage = req.body.commentMessage;
  const comment = blog.comments.find((com) => {
    if (com.commentID === commentId) return com;
  });
  if (!comment) {
    return next(new AppError(404, "Comment not found or deleted by owner."));
  }
  // Only the comment owner and admin can update the comment
  if (
    req.headers.tokenData.id === comment.commentOwnerID ||
    req.headers.tokenData.admin
  ) {
    await Blog.findOneAndUpdate(
      { _id: blogId },
      { $set: { "comments.$[elem].commentMessage": newCommentMessage } },
      { arrayFilters: [{ "elem.commentID": commentId }] }
    );
    return res
      .status(200)
      .json({ message: "Comment is updated.", success: true });
  } else {
    return next(new AppError(400, "You don't have permission."));
  }
});

/* DELETE */
exports.deleteBlog = asyncWrapper(async (req, res, next) => {
  const blogId = req.params.blogId;
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog)
    return next(new AppError(404, "Blog not found or deleted by owner."));
  // Only the blog owner and admin can delete the blog
  if (blog.author === req.headers.tokenData.id || req.headers.tokenData.admin) {
    await Blog.findOneAndDelete({ _id: blogId });
    return res.status(200).json({ message: "Blog is deleted.", success: true });
  }
  return next(new AppError(400, "You don't have permission."));
});

exports.deleteComment = asyncWrapper(async (req, res, next) => {
  const blogId = req.params.blogId;
  const blog = await Blog.findOne({ _id: blogId });
  if (!blog) {
    return next(new AppError(404, "Blog not found or deleted by owner."));
  }
  const commentId = req.params.commentId;
  const comment = blog.comments.find((com) => {
    if (com.commentID === commentId) return com;
  });
  if (!comment) {
    return next(new AppError(404, "Comment not found or already deleted by owner."));
  }
  // Only the comment owner and admin can delete the comment
  if (comment.commentOwnerID === req.headers.tokenData.id || req.headers.tokenData.admin) {
    await Blog.findOneAndUpdate({ _id: blogId },
      {
        $pull: {
          comments: {
            commentID: commentId
          }
        }
      }
    )
    return res.status(200).json({ message: "Comment is deleted.", success: true });
  } else {
    return next(new AppError(400, "You don't have permission."));
  }
});
