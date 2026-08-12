import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["ACTIVE", "COMPLETED", "ARCHIVED"],
        default: "ACTIVE"
    },
    
    coverImage : {
        type : String,
        default : ""
    }

}, { timestamps: true })


ProjectSchema.index(
    {
        name : 1,
        owner : 1
    },
    {
        unique : true
    }
)

export const Project = mongoose.model("Project", ProjectSchema)