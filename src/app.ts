import express from 'express';
import cors from 'cors';
import clienteRoutes from './routes/cliente';
import subscriptionRoutes from './routes/subscription';
import webRoutes from './routes/web';
import trackRoutes from './routes/track';
import adminRoutes from './routes/admin';
import { allowedOrigins } from './config/env';

const app = express();

app.use(cors({ origin: allowedOrigins(), credentials: true }));
app.use(express.json({ limit: '5mb' }));

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'core-api', timestamp: Date.now() });
});

app.use('/api/cliente', clienteRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/web', webRoutes);
app.use('/api/track', trackRoutes);
app.use('/api', adminRoutes); // activar-plan, reenviar-pin

export default app;
