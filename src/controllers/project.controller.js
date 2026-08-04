import Project from "../models/project.model.js"
import ApiError from "../utilities/apiError.js"
import ApiResponse from "../utilities/apiResponse.js"
import asyncHandler from "../utilities/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utilities/cloudinary.js"


const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const coverImageLocalPath = req.file?.path

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }

    const existedProject = await Project.findOne({
        owner: req.user._id,
        name
    })

    if (existedProject) {
        throw new ApiError(400, "Project with name already exists")
    }

    //upload image 
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //create new project
    try {
        const project = await Project.create({
            name: name,
            description: description,
            coverImage: coverImage?.url || "",
            owner: req.user._id
        })

        return res.status(201).json(new ApiResponse(201, project, "New project created successfully"))

    } catch (error) {
        //delete the uploaded image from cloudinary
        if (coverImage?.url)
            await deleteFromCloudinary(coverImage.url)

        throw error
    }

})


const getAllProjects = asyncHandler(async (req, res) => {

    const projects = await Project.find({
        owner: req.user._id,
    })

    if (!projects || !projects?.length) {
        throw new ApiError(404, "Project not found")
    }

    return res.status(200).json(new ApiResponse(200, projects, "All projects fetched successfully"))

})


const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId) {
        throw new ApiError(400, "Project Id is required")
    }

    const project = await Project.findOne({
        owner: req.user._id,
        _id: projectId
    })

    if (!project) {
        throw new ApiError(404, "Unauthorized request or Project does not exist ")
    }

    return res.status(200).json(new ApiResponse(200, project, "Fetched project successfully"))

})


const updateProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { name, description } = req.body
    const coverImageLocalPath = req.file?.path

    if (!projectId) {
        throw new ApiError(400, "Project Id required")
    }

    if (
        name === undefined &&
        description === undefined &&
        !coverImageLocalPath
    ) {
        throw new ApiError(400, "Nothing to update");
    }

    const existedProject = await Project.findOne({
        owner: req.user._id,
        name: name,
        _id: { $ne: projectId }
    })

    if (existedProject) {
        throw new ApiError(400, "Project with name already exists")
    }

    const project = await Project.findOne({
        _id: projectId,
        owner: req.user._id
    });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const oldCoverImageUrl = project.coverImage;

    const updateFields = {}

    if (name !== undefined) {
        updateFields.name = name
    }
    if (description !== undefined) {
        updateFields.description = description
    }

    let coverImage;
    if (coverImageLocalPath) {
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }

    if (coverImage?.url) {
        updateFields.coverImage = coverImage.url

    }

    try {
        const updatedProject = await Project.findOneAndUpdate(
            {
                _id: projectId,
                owner: req.user._id
            },
            {
                $set: updateFields
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedProject) {
            throw new ApiError(404, "Project not found or Unauthorized request")
        }

        //delete old coverImage:
        if (coverImage?.url) {
            await deleteFromCloudinary(oldCoverImageUrl)
        }

        return res.status(200).json(new ApiResponse(200, updatedProject, "Updated project successfully"))


    } catch (error) {
        //delete orphan file from cloudinary
        if (coverImage?.url) {
            await deleteFromCloudinary(coverImage.url)
        }
        throw error
    }


})


const deleteProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!projectId) {
        throw new ApiError(400, "ProjectId is required")
    }

    const deletedProject = await Project.findOneAndDelete({
        owner: req.user._id,
        _id: projectId
    })

    if (!deletedProject) {
        throw new ApiError(404, "Project not found or Unauthorized request")
    }

    //delete cloudinary file:
    await deleteFromCloudinary(deletedProject.coverImage)

    return res.status(200).json(new ApiResponse(200, deletedProject, "Deleted project successfully"))

})


export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById
}