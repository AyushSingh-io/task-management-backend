import { Project } from "../models/project.model.js"
import Task from "../models/task.model.js"
import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js"
import asyncHandler from "../utilities/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utilities/cloudinary.js"



const createTask = asyncHandler(async (req, res) => {
    //todo :  Future improvement :"assignedTo" belongs to the project's members before creating the task. Right now, any user ID could be assigned

    //todo : replace  owner-only check with a membership/role check later.

    const { projectId } = req.params

    const { name, description, status, priority, assignedTo, dueDate } = req.body


    if (!projectId) {
        throw new ApiError(400, "Project Id is required")
    }

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    } 

    const projectExists = await Project.exists({
        _id: projectId,
        owner: req.user._id
    })

    if (!projectExists) {
        throw new ApiError(404, "Project not found or unauthorized request")
    }

    const fields = {name, description, status, priority, assignedTo, dueDate}
    const creationFields = { project: projectId }

    const existedTask = await Task.findOne({
        name,
        project: projectId
    })

    if (existedTask) {
        throw new ApiError(400, "Task with name already exists")
    }

    for (const [key , value] of Object.entries(fields)) {
        if (value !== undefined) {
            creationFields[key] = value
        }
    }

    const createdTask = await Task.create(creationFields)
    return res.status(201).json(new ApiResponse(201, createdTask, "Task created successfully"))

})


const getAllTasks = asyncHandler(async (req, res) => {
    const {projectId} = req.params

    if(!projectId){
        throw new ApiError(400 , "Project Id is required")
    }

    const project = await Project.exists({
        _id  : projectId,
        owner : req.user._id
    })

    if(!project){
        throw new ApiError(404 , "Project not found or unauthorized request")
    }

    const tasks = await Task.find({
        project : projectId,
    })

    return res.status(200).json(new ApiResponse(200, tasks , "Fetched all tasks successfully"))

})


export {
    createTask,
    getAllTasks,
}