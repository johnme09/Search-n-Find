import { Schema, model, Types, type InferSchemaType } from 'mongoose'

const historySchema = new Schema(
    {
        itemId: {
            type: Types.ObjectId,
            ref: 'Item',
            required: true,
            index: true,
        },
        claimantEmail: { type: String, required: true },
        status: { type: String, required: true },
        decisionDate: { type: Date, default: () => new Date(), required: true },
        note: { type: String, required: true },
    },
    { timestamps: true },
)

export type ClaimHistoryDoc = InferSchemaType<typeof historySchema> & {
    _id: string
}
export const ClaimHistory = model('ClaimHistory', historySchema)