const bcrypt = require("bcryptjs");
const User = require('../models/user');


// GET /api/users/me
exports.getMe = async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

// PUT /api/users/me
exports.updateMe = async (req, res) => {
    const allowed = [
        "firstName",
        "lastName",
        "userName",
        "email",
        "dob",
        "interest",
        "level",
        "goal",
        "newsletter",
    ];

    const patch = {};
    for (const k of allowed) {
        if (req.body[k] !== undefined) patch[k] = req.body[k];
    }

    const user = await User.findByIdAndUpdate(req.userId, patch, {
        new: true,
        runValidators: true,
        context: "query",
    }).select("-passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

const sanitizeUser = (u) => ({
    _id: u._id,
    firstName: u.firstName,
    lastName: u.lastName,
    userName: u.userName,
    email: u.email,
    dob: u.dob,
    interest: u.interest,
    level: u.level,
    goal: u.goal,
    newsletter: u.newsletter,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
});

function isAtLeast18(dob) {
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age >= 18;
}

exports.registerUser = async (req, res, next) => {

    try {

        const {
            firstName,
            lastName,
            userName,
            email,
            dob,
            interest,
            level,
            goal,
            newsletter = false,
            password, // we get plain password from client
        } = req.body;

        if (!isAtLeast18(dob)) {
            return res.status(400).json({ message: "You must be at least 18 years old to register." });
        }

        if (!password || String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 charachters," });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            userName,
            email: String(email).toLowerCase().trim(),
            dob,
            interest,
            level,
            goal,
            newsletter,
            passwordHash,
        });

        res.status(201).json(sanitizeUser(user));
    } catch (error) {
        // duplicated email or username
        if (error?.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || "field";
            return res.status(409).json({ message: `${field} already exists. Choose something Else` });
        }
        return next(error);
    }
};