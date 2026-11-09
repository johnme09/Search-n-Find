import { Schema, model, Types, type InferSchemaType } from 'mongoose'

const itemSchema = new Schema(
    {
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        name: { type: String, required: true, trim: true, maxlength: 200 },
        category: { type: String, required: true, trim: true, maxlength: 100 },
        location: { type: String, required: true, trim: true, maxlength: 200 },
        status: {
            type: String,
            enum: ['Lost', 'Found'],
            required: true,
            index: true,
        },
        lifecycle: {
            type: String,
            enum: [
                'Active',
                'Claim Requested',
                'Claim Approved',
                'Returned',
                'Closed',
            ],
            default: 'Active',
            required: true,
            index: true,
        },
        date: { type: String, required: true }, // ISO date (YYYY-MM-DD)
        description: { type: String, required: true, maxlength: 2000 },
    },
    { timestamps: true },
)

itemSchema.index({ name: 'text', description: 'text' })

export type ItemDoc = InferSchemaType<typeof itemSchema> & { _id: string }
export const Item = model('Item', itemSchema)