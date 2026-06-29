import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';
import Image from 'next/image';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getServerSideProps() {
  const { data: deals, error } = await supabase
    .from('donchepito_curated')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.error('Database reconciliation failed:', error);
    return { props: { deals: [] } }; // Fail-safe to prevent server crash
  }

  return { props: { deals: deals || [] } };
}

export default function Home({ deals }) {
  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <Head>
        <title>Don Chepito Curated Deals</title>
        <meta name="description" content="Ofertas seleccionadas a mano para ti." />
      </Head>
      
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', marginTop: '10px' }}>
          🔥 Don Chepito Deals
        </h1>
        <p style={{ color: '#555' }}>
          Ofertas seleccionadas a mano para ti.
        </p>
      </header>

      {deals.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777', fontWeight: '500' }}>El inventario se está actualizando. Vuelve pronto.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {deals.map((deal) => (
            <article key={deal.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {deal.image_url && (
                  <div style={{ position: 'relative', width: '100%', height: '160px', marginBottom: '12px' }}>
                    <Image 
                      src={deal.image_url} 
                      alt={deal.title || 'Oferta Exclusiva'} 
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                      style={{ objectFit: 'contain', borderBottom: '1px solid #f3f4f6' }}
                      priority={deals.indexOf(deal) < 4} // Pre-load the top row for instant rendering
                    />
                  </div>
                )}
                <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0', color: '#1a1a1a', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {deal.title}
                </h3>
                <p style={{ color: '#900C3F', fontWeight: 'bold', fontSize: '18px', margin: '0 0 12px 0' }}>
                  ${deal.price}
                </p>
              </div>
              <a href={deal.link_url} target="_blank" rel="noopener noreferrer nofollow sponsored" style={{ display: 'block', background: '#EEC942', color: '#000', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', transition: 'opacity 0.2s' }}>
                Ver en Amazon
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
