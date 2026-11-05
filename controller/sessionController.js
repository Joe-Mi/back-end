const getSessionModels = (req) => {
    const Session = req.app.locals.models?.Session;

    if (!Session) {
        throw new Error("[ERROR] Models not initialized.");
    }

    return Session;
};

const getAuthenticatedUserId = (req) => {
    const userId = req.user?._id;
    if (typeof userId !== "string" || !userId) {
        const error = new Error("Authenticated user is missing from the request");
        error.status = 401;
        throw error;
    }
    return userId;
};

const requireMatchingUserId = (req, res, userId) => {
    if (req.params.id !== userId) {
        res.status(403).json({ error: "Access denied" });
        return false;
    }
    return true;
};

// Display list of all User Sessions.
export const getSessions = async (req, res, next) => {
    try {
        const userId = getAuthenticatedUserId(req);
        if (!requireMatchingUserId(req, res, userId)) {
            return;
        }
        const Session = getSessionModels(req);
        const userSessions = await Session.findAll({ where: { user_id: userId } });
        res.json(userSessions);
    } catch (err) {
        next(err);
    }
};


// Handle User account registration on POST.
export const createSession = async (req, res, next) => {
    try {
        const { objective, budget = 0, mainLocation } = req.body ?? {};
        const userId = getAuthenticatedUserId(req);
        if (!requireMatchingUserId(req, res, userId)) {
            return;
        }
        if ([objective, mainLocation].some((value) => typeof value !== "string" || !value.trim())) {
            return res.status(400).json({
                error: "Objective and mainLocation are required",
            });
        }
        if (!Number.isInteger(budget) || budget < 0) {
            return res.status(400).json({ error: "Budget must be a non-negative integer" });
        }

        const Session = getSessionModels(req);
        const session = await Session.create({
            objective: objective.trim(),
            mainLocation,
            budget,
            user_id: userId
        });

        const sessionData = session.get({ plain: true });
        res.status(201).json(sessionData);
    } catch (err) {
        next(err)
    }
};

// Handle Session deletion.
export const deleteSession = async (req, res, next) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const Session = getSessionModels(req);
        const deletedCount = await Session.destroy({
            where: { _id: req.params.id, user_id: userId },
        });
        if (!deletedCount) {
            return res.status(404).json({ error: "Session not found" });
        }
        res.status(204).end();
    } catch (err) {
        next(err)
    }
};

// Update Session details.
export const updateSession = async (req, res, next) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const allowedFields = ['objective', 'budget', 'mainLocation'];
        const updates = Object.fromEntries(
            allowedFields
                .filter((field) => req.body?.[field] !== undefined)
                .map((field) => [field, req.body[field]])
        );
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: "At least one session field must be provided" });
        }

        if (
            (updates.objective !== undefined &&
                (typeof updates.objective !== "string" || !updates.objective.trim())) ||
            (updates.mainLocation !== undefined &&
                (typeof updates.mainLocation !== "string" || !updates.mainLocation.trim())) ||
            (updates.budget !== undefined &&
                (!Number.isInteger(updates.budget) || updates.budget < 0))
        ) {
            return res.status(400).json({
                error: "Objective and mainLocation must be non-empty strings; budget must be a non-negative integer",
            });
        }

        if (typeof updates.objective === "string") {
            updates.objective = updates.objective.trim();
        }

        const Session = getSessionModels(req);
        const [updatedCount] = await Session.update(updates, {
            where: { _id: req.params.id, user_id: userId },
        });
        if (!updatedCount) {
            return res.status(404).json({ error: "Session not found" });
        }
        res.json({ message: "Session updated" });
    } catch (err) {
        next(err)
    }
};