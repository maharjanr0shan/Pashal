const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://roshanmharjan8:mong0roshan@cluster0.pltce.mongodb.net/Ecommerce",
    );
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = dbConnect;
