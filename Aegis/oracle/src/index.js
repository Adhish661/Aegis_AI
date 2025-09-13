import dotenv from 'dotenv';
dotenv.config({ path: './env.local' });
import express from 'express';
import logger from './logger.js';
import { startWatcher, getAuditLog } from './watcher.js';

const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
app.get('/audit', (req, res) => {res.json(getAuditLog());
});
app.post("/admin/freeze", async (req, res) => {
    try{
        const { address, reason } = req.body;
        if (!address || !reason) return res.status(400).send("address and reason required!");
        res.json({ok:true , note:"Admin freeze not wired to contract in this minimal API. Use CLI or extend."});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    logger.info(`API listening on http://localhost:${PORT}`);
    await startWatcher();
});

