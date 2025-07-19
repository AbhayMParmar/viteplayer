import mongoose from "mongoose";


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "Spotifyclone",
        });
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.log(error);
    }
}

export default connectDB;