import { Router } from 'express';

const router = Router();

router.post('/link-open', (req, res) => {
  const { slug, leadId, leadPhone } = req.body || {};
  console.log('[track] link-open', { slug, leadId, leadPhone, ts: Date.now() });
  res.json({ success: true });
});

export default router;
