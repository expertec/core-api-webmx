import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { findNegocioBySlug, upsertNegocio, listNegocios, getNegocio } from '../store/inMemory';
import { generateSiteQueue } from '../jobs/queues';

const router = Router();

router.post('/after-form', async (req, res) => {
  const { leadPhone, summary } = req.body || {};
  if (!leadPhone || !summary) {
    return res.status(400).json({ error: 'Faltan leadPhone o summary' });
  }
  const slug = (summary.slug || `site-${uuid().slice(0, 6)}`).toLowerCase();

  const negocio = upsertNegocio({
    slug,
    companyInfo: summary.companyName || 'Negocio',
    templateId: summary.templateId || 'info',
    leadPhone,
    contactEmail: summary.contactEmail || summary.email,
    contactWhatsapp: summary.contactWhatsapp || leadPhone,
    logoURL: summary.logoURL,
    status: 'pending',
    plan: 'trial',
  });

  await generateSiteQueue.enqueue({ negocioId: negocio.id });

  res.json({ success: true, negocioId: negocio.id, slug: negocio.slug, status: negocio.status });
});

router.get('/site/:slug', (req, res) => {
  const slug = req.params.slug;
  const negocio = findNegocioBySlug(slug);
  if (!negocio) {
    return res.status(404).json({ error: 'No encontrado' });
  }
  res.json({ success: true, data: negocio.schema || {} });
});

router.post('/update/:negocioId', (req, res) => {
  const { negocioId } = req.params;
  const updates = req.body || {};
  const existing = getNegocio(negocioId);
  if (!existing) {
    return res.status(404).json({ error: 'Negocio no encontrado' });
  }
  upsertNegocio({
    id: negocioId,
    schema: { ...(existing.schema || {}), ...updates },
    status: 'live',
  });
  res.json({ success: true });
});

router.get('/pending', (_req, res) => {
  const pending = listNegocios().filter((n) => n.status === 'pending' || n.status === 'processing');
  res.json({ success: true, data: pending });
});

export default router;
