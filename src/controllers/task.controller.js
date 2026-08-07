import { Project } from "../models/project.model.js"
import { Task } from "../models/task.model.js"
import { ProjectMember } from "../models/projectMember.model.js"
import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js"
import asyncHandler from "../utilities/asyncHandler.js"
import { getProjectUserRole, isTaskAssigned } from "../services/permission.service.js"



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

    // const projectExists = await Project.exists({
    //     _id: projectId,
    //     owner: req.user._id
    // })

    // if (!projectExists) {
    //     throw new ApiError(404, "Project not found or unauthorized request")
    // }

    const role = await getProjectUserRole(projectId, req.user._id)
    if (role !== "ADMIN" && role !== "OWNER") {
        throw new ApiError(403, "Unauthorized request")
    }

    const fields = { name, description, status, priority, assignedTo, dueDate }
    const creationFields = { project: projectId }

    const existedTask = await Task.findOne({
        name,
        project: projectId
    })

    if (existedTask) {
        throw new ApiError(400, "Task with name already exists")
    }

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            creationFields[key] = value
        }
    }

    const createdTask = await Task.create(creationFields)
    return res.status(201).json(new ApiResponse(201, createdTask, "Task created successfully"))

})


const getAllTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId) {
        throw new ApiError(400, "Project Id is required")
    }

    const role = await getProjectUserRole(projectId, req.user._id)
    if (role !== "ADMIN" && role !== "OWNER") {
        throw new ApiError(403, "Unauthorized request")
    }

    const tasks = await Task.find({
        project: projectId,
    })

    return res.status(200).json(new ApiResponse(200, tasks, "Fetched all tasks successfully"))

})


const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params

    if (!taskId) {
        throw new ApiError(400, "Task Id is required")
    }

    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const projectId = task.project

    const role = await getProjectUserRole(projectId, req.user._id)
    const isAssignee = await isTaskAssigned(task, req.user._id)

    if (role === "NON_MEMBER" || (role === "MEMBER" && isAssignee === false)) {
        throw new ApiError(403, "Unauthorized request")
    }

    return res.status(200).json(new ApiResponse(200, task, "Fetched task successfully"))

})


const updateTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { name, description, priority, dueDate, completedAt } = req.body

    if (!taskId) {
        throw new ApiError(400, "Task id is required")
    }

    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const projectId = task.project
    const role = await getProjectUserRole(projectId, req.user._id)

    if (role === "MEMBER" || role === "NON_MEMBER") {
        throw new ApiError(403, "Unauthorized request")
    }

    const fields = { name, description, priority, dueDate, completedAt }
    const fieldsToUpdate = {}

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            fieldsToUpdate[key] = value
        }
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        fieldsToUpdate,
        {
            new: true,
            runValidators: true
        })

    return res.status(200).json(new ApiResponse(200, updatedTask, "Updated task successfully"))

})


const deleteTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params

    if (!taskId) {
        throw new ApiError(400, "Task Id is required")
    }

    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const projectId = task.project
    const role = await getProjectUserRole(projectId, req.user._id)

    if (role === "MEMBER" || role === "NON_MEMBER") {
        throw new ApiError(403, "Unauthorized request")
    }

    const deletedTask = await Task.findByIdAndDelete(taskId)

    return res.status(200).json(new ApiResponse(200, deletedTask, "Deleted task successfully"))

})


const assignTask = asyncHandler(async (req, res) => {
    //todo : correct the logic of projectMember
    const { taskId } = req.params
    const { assignedTo } = req.body

    if (!taskId || !assignedTo) {
        throw new ApiError(400, "Task Id and assigned user id are required")
    }

    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const taskOldAssignee = task.assignedTo

    const projectId = task.project
    const role = await getProjectUserRole(projectId, req.user._id)
    const isAssignee = await isTaskAssigned(task, req.user._id)

    if (role === "MEMBER" || role === "NON_MEMBER") {
        throw new ApiError(403, "Unauthorized request")
    }

    task.assignedTo = assignedTo
    await task.save()

    await ProjectMember.create({
        member: assignedTo,
        project: projectId,
    })

    return res.status(200).json(new ApiResponse(200, task, "Assigned User successfully"))

})


const updateTaskStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { status } = req.body

    if (!taskId || !status) {
        throw new ApiError(400, "Task Id and status are required")
    }

    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const projectId = task.project
    const role = await getProjectUserRole(projectId, req.user._id)
    const isAssignee = await isTaskAssigned(task, req.user._id)

    if ((role === "MEMBER" && !isAssignee) || role === "NON_MEMBER") {
        throw new ApiError(403, "Unauthorized request")
    }

    task.status = status
    await task.save();

    return res.status(200).json(new ApiResponse(200, task, "Update status successfully"))

})


const getAllAssignedTasks = asyncHandler(async (req, res) => {

    const assignedTasks = await Task.find({
        assignedTo: req.user._id
    })
        .populate("project")

    return res.status(200).json(new ApiResponse(200, assignedTasks, "Fetched all assigned tasks successfully"))

})


export {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById,
    assignTask,
    updateTaskStatus,
    getAllAssignedTasks
}