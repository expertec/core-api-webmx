import { Router } from 'express';

const router = Router();

router.post('/create-checkout', (req, res) => {
  const { phone, email, negocioId } = req.body || {};
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Falta phone' });
  }
  res.json({
    success: true,
    checkoutUrl: 'https://example.com/checkout',
    sessionId: 'mock-session',
    phone,
    email,
    negocioId,
  });
});

router.get('/status/:negocioId', (req, res) => {
  res.json({
    success: true,
    subscription: {
      status: 'active',
      plan: 'pro',
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    },
  });
});

router.post('/portal', (_req, res) => {
  res.json({ success: true, url: 'https://example.com/billing' });
});

router.post('/cancel', (_req, res) => {
  res.json({ success: true, message: 'Suscripción cancelada (mock)' });
});

router.post('/trial', (_req, res) => {
  res.json({ success: true, data: { trialEndsAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString() } });
});

export default router;
