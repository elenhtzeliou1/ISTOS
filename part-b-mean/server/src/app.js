const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const categoriesRoutes = require("./routes/categories.routes");
const coursesRoutes = require("./routes/courses.routes");
const booksRoutes = require("./routes/books.routes");
const videosRoutes = require("./routes/videos.routes");
const usersRoutes = require("./routes/users.routes");
const enrollmentsRoutes = require("./routes/enrollments.routes");
const reviewsRoutes = require("./routes/reviews.routes");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/users.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/categories", categoriesRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/videos", videosRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/enrollments", enrollmentsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/auth", authRoutes);



app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});