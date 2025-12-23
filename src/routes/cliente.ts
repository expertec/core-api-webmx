import { Router } from 'express';
import { createSession, getSession, getNegocio, upsertNegocio } from '../store/inMemory';

const router = Router();

router.post('/login', (req, res) => {
  const { phone, pin } = req.body || {};
  if (!phone || !pin) {
    return res.status(400).json({ success: false, error: 'Faltan phone o pin' });
  }

  // En un entorno real, validarías contra DB + PIN
  const negocio = upsertNegocio({
    companyInfo: 'Negocio demo',
    contactWhatsapp: phone,
    status: 'live',
    plan: 'pro',
    templateId: 'info',
  });

  const session = createSession(negocio.id);
  const data = {
    id: negocio.id,
    negocioId: negocio.id,
    companyInfo: negocio.companyInfo,
    slug: negocio.slug,
    plan: negocio.plan,
    templateId: negocio.templateId,
    expiresAt: negocio.expiresAt,
    logoURL: negocio.logoURL,
    token: session.token,
  };

  res.json({ success: true, data });
});

router.post('/verificar-sesion', (req, res) => {
  const { token } = req.body || {};
  const session = getSession(token);
  if (!session) {
    return res.json({ success: false, error: 'Token inválido' });
  }
  const negocio = getNegocio(session.negocioId);
  if (!negocio) {
    return res.json({ success: false, error: 'Negocio no encontrado' });
  }
  const data = {
    id: negocio.id,
    negocioId: negocio.id,
    companyInfo: negocio.companyInfo,
    slug: negocio.slug,
    plan: negocio.plan,
    templateId: negocio.templateId,
    expiresAt: negocio.expiresAt,
    logoURL: negocio.logoURL,
    token: session.token,
  };
  res.json({ success: true, data });
});

router.post('/logout', (req, res) => {
  const { token } = req.body || {};
  if (token) {
    // Opcional: eliminar token
  }
  res.json({ success: true });
});

export default router;
