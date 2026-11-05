import bcrypt from 'bcrypt';

const getUserModel = (req) => {
    const User = req.app.locals.models?.User;
    if (!User) {
        throw new Error("User model is not initialized");
    }
    return User;
};

// Display list of all Users.
export const User_list = async (req, res, next) => {
    try {
        const User = getUserModel(req);
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        res.json(users);
    } catch (err) {
        next(err);
    }
};


// Handle User account registration on POST.
export const User_register = async (req, res, next) => {
    try {
        const { userName, firstName, lastName, email, password } = req.body ?? {};
        if ([userName, firstName, email, password].some((value) => typeof value !== "string" || !value)) {
            return res.status(400).json({
                error: "Username, first name, email, and password are required",
            });
        }

        const User = getUserModel(req);
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        var hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            userName,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isAdmin: false,
        });

        const userData = user.get({ plain: true });
        delete userData.password;
        res.status(201).json(userData);
    } catch (err) {
        next(err)
    }
};


// Handle User account deletion.
export const User_delete_account = async (req, res, next) => {
    try {
        const User = getUserModel(req);
        const deletedCount = await User.destroy({
            where: { _id: req.params.id },
        });
        if (!deletedCount) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(204).end();
    } catch (err) {
        next(err)
    }
};

// Update User account details.
export const User_update_account = async (req, res, next) => {
    try {
        const allowedFields = ["userName", "firstName", "lastName", "email", "age", "isAdmin"];
        const updates = Object.fromEntries(
            allowedFields
                .filter((field) => req.body?.[field] !== undefined)
                .map((field) => [field, req.body[field]])
        );
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "At least one account field must be provided" });
        }

        const User = getUserModel(req);
        const [updatedCount] = await User.update(updates, {
            where: { _id: req.params.id },
        });
        if (!updatedCount) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User updated" });
    } catch (err) {
        next(err)
    }
};
