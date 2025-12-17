const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const coursesRoutes = require("./routes/courses.routes");
const usersRoutes = require("./routes/users.routes");
const enrollmentsRoutes = require("./routes/enrollments.routes");
const reviewsRoutes = require("./routes/reviews.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/courses", coursesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/enrollments", enrollmentsRoutes);
app.use("/api/reviews", reviewsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});