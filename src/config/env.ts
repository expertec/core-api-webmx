import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.CORE_PORT || process.env.PORT || 4000),
  frontOrigins: (process.env.CORE_FRONT_ORIGINS || process.env.FRONT_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean),
  whatsappApiBase: (process.env.WHATSAPP_API_BASE || process.env.REACT_APP_WHATSAPP_API_BASE || '').replace(/\/+$/, ''),
};

export function allowedOrigins() {
  // fallback amplio en dev
  return env.frontOrigins.length ? env.frontOrigins : ['http://localhost:3000', 'http://localhost:5173'];
}
