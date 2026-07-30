import mongoose, { Schema } from "mongoose";

const projectMemberSchema = new Schema({
    member: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    role: {
        type: String,
        enum: ["OWNER", "ADMIN", "MEMBER"],
        default: "MEMBER"
    }

}, { timestamps: true })


projectMemberSchema.index(
    {
        project: 1,
        member: 1
    },
    { unique: true }
)

export const ProjectMember = mongoose.model("ProjectMember", projectMemberSchema)