import { Task } from "../models/task.model.js"
import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js"
import asyncHandler from "../utilities/asyncHandler.js"
import { getProjectUserRole } from "../services/permission.service.js"
import { Project } from "../models/project.model.js"
import { Comment } from "../models/comment.model.js"


const createComment = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { content } = req.body

    if (!taskId || !content) {
        throw new ApiError(400, "TaskId and Content are required")
    }

    const task = await Task.findById(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const projectId = task.project

    const isAuthorized = await getProjectUserRole(projectId, req.user._id)

    if (isAuthorized === "NON_MEMBER") {
        throw new ApiError(403, "Unauthorized request")
    }

    const comment = await Comment.create({
        content,
        task: taskId,
        owner: req.user._id
    })

    return res.status(201).json(new ApiResponse(201, comment, "Add Comment successfully"))

})


const getAllComments = asyncHandler(async (req, res) => {
    const { taskId } = req.params

    if (!taskId) {
        throw new ApiError(400, "TaskId is required")
    }

    const task = await Task.findById(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const projectId = task.project

    const isAuthorized = await getProjectUserRole(projectId, req.user._id)

    if (isAuthorized === "NON_MEMBER") {
        throw new ApiError(403, "Unauthorized request")
    }

    const allComments = await Comment.find({
        task: taskId
    })
    
    return res.status(200).json(new ApiResponse(200, allComments, "Fetched all comments successfully"))

})


const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const { content } = req.body

    if (!commentId || !content) {
        throw new ApiError(400, "CommentId and content are required")
    }

    const updatedComment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user._id
        },
        {
            content
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedComment) {
        throw new ApiError(404, "Comment not found or Unauthorized request")
    }

    return res.status(200).json(new ApiResponse(200, updatedComment, "Update comment successfully"))

})


const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!commentId) {
        throw new ApiError(400, "CommentId is required")
    }

    const comment = await Comment
        .findById(commentId)
        .populate({ path: "task", select: "project" })

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const projectId = comment.task.project

    const isAuthorized = await getProjectUserRole(projectId, req.user._id);

    if (!(isAuthorized === "OWNER" || isAuthorized === "ADMIN" || comment.owner.equals(req.user._id))) {
        throw new ApiError(403, "Unauthorized request")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    if (!deletedComment) {
        throw new ApiError(400, "Comment not found")
    }

    return res.status(200).json(new ApiResponse(200, deletedComment, "Deleted comment successfully"))

})


export {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
}