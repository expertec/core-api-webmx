import { v4 as uuid } from 'uuid';

export type NegocioStatus = 'pending' | 'processing' | 'live' | 'failed' | 'demo' | 'trial';

export interface Negocio {
  id: string;
  slug: string;
  companyInfo: string;
  templateId: string;
  status: NegocioStatus;
  plan: string;
  expiresAt?: string;
  schema?: any;
  leadPhone?: string;
  contactEmail?: string;
  contactWhatsapp?: string;
  logoURL?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TokenSession {
  token: string;
  negocioId: string;
  createdAt: string;
}

const negocios = new Map<string, Negocio>();
const tokens = new Map<string, TokenSession>();

function nowISO() {
  return new Date().toISOString();
}

export function upsertNegocio(partial: Partial<Negocio>): Negocio {
  const id = partial.id || uuid();
  const existing = negocios.get(id);
  const n: Negocio = {
    id,
    slug: partial.slug || existing?.slug || `site-${id.slice(0, 6)}`,
    companyInfo: partial.companyInfo || existing?.companyInfo || 'Negocio',
    templateId: partial.templateId || existing?.templateId || 'info',
    status: partial.status || existing?.status || 'pending',
    plan: partial.plan || existing?.plan || 'trial',
    expiresAt: partial.expiresAt || existing?.expiresAt,
    schema: partial.schema ?? existing?.schema,
    leadPhone: partial.leadPhone || existing?.leadPhone,
    contactEmail: partial.contactEmail || existing?.contactEmail,
    contactWhatsapp: partial.contactWhatsapp || existing?.contactWhatsapp,
    logoURL: partial.logoURL || existing?.logoURL,
    errorMessage: partial.errorMessage,
    createdAt: existing?.createdAt || nowISO(),
    updatedAt: nowISO(),
  };
  negocios.set(id, n);
  return n;
}

export function findNegocioBySlug(slug: string): Negocio | undefined {
  const s = slug.toLowerCase();
  for (const n of negocios.values()) {
    if (n.slug.toLowerCase() === s) return n;
  }
  return undefined;
}

export function getNegocio(id: string): Negocio | undefined {
  return negocios.get(id);
}

export function listNegocios() {
  return Array.from(negocios.values());
}

export function createSession(negocioId: string) {
  const token = uuid();
  const session: TokenSession = { token, negocioId, createdAt: nowISO() };
  tokens.set(token, session);
  return session;
}

export function getSession(token: string | undefined | null): TokenSession | undefined {
  if (!token) return undefined;
  return tokens.get(token);
}

export function removeSession(token: string) {
  tokens.delete(token);
}
