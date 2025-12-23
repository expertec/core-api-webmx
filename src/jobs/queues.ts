import { upsertNegocio, Negocio } from '../store/inMemory';

type JobHandler<T> = (data: T) => Promise<void>;

// Cola en memoria para no depender de Redis en este scaffolding
function createInMemoryQueue<T>(handler: JobHandler<T>) {
  const enqueue = async (data: T) => {
    setTimeout(() => {
      handler(data).catch((err) => {
        console.error('[queue] job error', err);
      });
    }, 50); // breve delay para simular async
  };
  return { enqueue };
}

export interface GenerateSitePayload {
  negocioId: string;
}

export const generateSiteQueue = createInMemoryQueue<GenerateSitePayload>(async ({ negocioId }) => {
  const base: Partial<Negocio> = {
    id: negocioId,
    status: 'processing',
  };
  upsertNegocio(base);

  // Simula generación de sitio/IA
  setTimeout(() => {
    const schema = {
      templateId: 'info',
      hero: {
        title: 'Tu sitio está listo',
        subtitle: 'Reemplaza este texto con la lógica de IA real',
        cta: 'Contáctanos',
      },
      colors: {
        primary: '#1890ff',
        secondary: '#ffffff',
        accent: '#f4f6fb',
        text: '#1f2937',
      },
    };
    upsertNegocio({
      id: negocioId,
      status: 'live',
      schema,
    });
    console.log(`[generateSite] negocio ${negocioId} marcado como live`);
  }, 500);
});
