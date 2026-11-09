import { Schema, model, Types, type InferSchemaType } from 'mongoose'

const claimSchema = new Schema(
    {
        itemId: {
            type: Types.ObjectId,
            ref: 'Item',
            required: true,
            index: true,
        },
        claimantId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        description: { type: String, required: true, maxlength: 2000 },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Denied'],
            default: 'Pending',
            required: true,
            index: true,
        },
        decidedAt: { type: Date, default: null },
    },
    { timestamps: true },
)

claimSchema.index(
    { itemId: 1, claimantId: 1, status: 1 },
    { unique: false },
)

export type ClaimDoc = InferSchemaType<typeof claimSchema> & { _id: string }
export const Claim = model('Claim', claimSchema)