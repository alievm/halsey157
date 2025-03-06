const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const clothingRoutes = require("./routes/clothingRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subCategoryRoutes = require("./routes/subCategoryRoutes");
const errorHandler = require("./middlewares/errorHandler");
const newsRoutes = require("./routes/newsRoutes");
const voteRoutes = require('./routes/voteRoutes');
const staffRoutes = require('./routes/staffRoutes');
const positionRoutes = require('./routes/positionRoutes');
const authorRoutes = require('./routes/authorRoutes');
const classRoutes = require('./routes/classRoutes');
const morningAnnouncementRoutes = require('./routes/morningAnnouncementRoutes');
dotenv.config();
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const path = require("path");

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/categories", categoryRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/articles", articleRoutes);
app.use('/api/auth', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/morning-announcements', morningAnnouncementRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/staff", staffRoutes);
app.use('/api/classes', classRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
