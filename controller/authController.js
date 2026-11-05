import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const getUserModel = (req) => {
    const User = req.app.locals.models?.User;
    if (!User) {
        throw new Error("User model is not initialized");
    }
    return User;
};

const generateAuthToken = (id) => jwt.sign({ _id: id }, process.env.JWT_SECRET_KEY);

// Authenticate and Display details of a specific User.
export const User_auth = async (req, res, next) => {
    try {
        const { email, password } = req.body ?? {};
        if (typeof email !== "string" || !email || typeof password !== "string" || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const User = getUserModel(req);
        const user = await User.findOne({
            where: { email },
            //attributes: { exclude: ["password"] },
        });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );
        if (!validPassword)
            return res.status(401).send("Invalid email or password");

        const token = generateAuthToken(user._id);
        res.send(token);
        //res.json(user);
    } catch (err) {
        next(err)
    }
};
