import mongoose, {Document, Schema} from "mongoose";

// order Interface
export interface IOrder extends Document {
    userId : string;
    courseId: string;
    payment_Info : object;
}

const orderSchema = new Schema<IOrder>({
    userId: { type: String, required: true },
    courseId: {type: String, required: true},
    payment_Info : {type: Object}
}, {timestamps : true});


const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;