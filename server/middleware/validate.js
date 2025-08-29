
function validate(req, res, next) {
    const { message, level, source, metadata } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'message is required to be string' });
    }

    if (typeof level !== 'string' || !level.trim()) {
        return res.status(400).json({ error: 'message is required to be string' });
    }

    if (typeof source !== 'string' || !source.trim()) {
        return res.status(400).json({ error: 'message is required to be string' });
    }

    if (typeof metadata !== 'string' || !metadata.trim()) {
        return res.status(400).json({ error: 'message is required to be string' });
    }

    next();
}

module.exports = validate;