import mongoose from "mongoose";
import { DB_Name } from "../constraints.js";
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`\n MongoDB Connected !! DB HOST:${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoD Connection error", error);
        process.exit(1)
    }
}

export default connectDB