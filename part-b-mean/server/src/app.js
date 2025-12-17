const express = require('express');

const app = express();
const PORT = 5000;

app.use(express.json());

const coursesRoutes = require('./routes/courses.routes');
app.use('/api/courses', coursesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});