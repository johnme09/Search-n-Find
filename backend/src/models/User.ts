import { Schema, model, type InferSchemaType } from 'mongoose'

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 100 },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        passwordHash: { type: String, required: true },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            required: true,
        },
    },
    { timestamps: true },
)

export type UserDoc = InferSchemaType<typeof userSchema> & {
    _id: string
}

export const User = model('User', userSchema)