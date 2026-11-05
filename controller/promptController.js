import agent from '../agent.js';

const getModels = (req) => {
    const models = req.app.locals.models;
    const { Prompt, Response, Session } = models ?? {};

    if (!Prompt || !Response || !Session) {
        throw new Error("Prompt, response, and session models are not initialized");
    }

    return { Prompt, Response, Session };
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

const getOwnedSession = async (Session, sessionId, userId) =>
    Session.findOne({ where: { _id: sessionId, user_id: userId } });

// Display prompts for a session, including their responses.
export const getPrompts = async (req, res, next) => {
    try {
        const { Prompt, Response, Session } = getModels(req);
        const userId = getAuthenticatedUserId(req);
        const sessionId = req.params.id;
        if (typeof sessionId !== "string" || !sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }

        const session = await getOwnedSession(Session, sessionId, userId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        const prompts = await Prompt.findAll({
            where: { session_id: sessionId, user_id: userId },
            include: [{ model: Response, as: "Response" }],
            order: [["time", "ASC"]],
        });
        res.json(prompts);
    } catch (err) {
        next(err);
    }
};

// Generate and store a response for an authenticated user's session.
export const createPrompt = async (req, res, next) => {
    try {
        const { Prompt, Response, Session } = getModels(req);
        const userId = getAuthenticatedUserId(req);
        const sessionId = req.params.id;
        const { query } = req.body ?? {};

        if (typeof sessionId !== "string" || !sessionId) {
            return res.status(400).json({ error: "Session ID is required" });
        }
        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({ error: "Prompt query is required" });
        }

        const session = await getOwnedSession(Session, sessionId, userId);
        if (!session) {
            return res.status(404).json({ error: "Session not found" });
        }

        const responseData = await agent.handlePrompt(query.trim(), sessionId);
        const { prompt, response } = await Prompt.sequelize.transaction(async (transaction) => {
            const prompt = await Prompt.create({
                query: query.trim(),
                session_id: sessionId,
                user_id: userId,
            }, { transaction });

            const response = await Response.create({
                result: responseData,
                prompt_id: prompt._id,
            }, { transaction });

            return { prompt, response };
        });

        res.status(201).json({
            prompt: prompt.get({ plain: true }),
            response: response.get({ plain: true }),
        });
    } catch (err) {
        next(err);
    }
};
