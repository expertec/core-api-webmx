import { Router } from 'express';
import { upsertNegocio, getNegocio } from '../store/inMemory';

const router = Router();

router.post('/activar-plan', (req, res) => {
  const { negocioId, plan, descripcion } = req.body || {};
  if (!negocioId || !plan) {
    return res.status(400).json({ error: 'Faltan negocioId o plan' });
  }
  const negocio = upsertNegocio({ id: negocioId, plan, status: 'live' });
  console.log('[admin] activar-plan', { negocioId, plan, descripcion });
  res.json({ success: true, data: negocio });
});

router.post('/reenviar-pin', (req, res) => {
  const { negocioId } = req.body || {};
  if (!negocioId) return res.status(400).json({ error: 'Falta negocioId' });
  const n = getNegocio(negocioId);
  if (!n) return res.status(404).json({ error: 'Negocio no encontrado' });
  console.log('[admin] reenviar-pin', { negocioId });
  res.json({ success: true, message: 'PIN reenviado (mock)' });
});

export default router;
