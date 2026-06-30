import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

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
    console.error('Database error:', error);
    return { props: { deals: [] } };
  }

  return { props: { deals: deals || [] } };
}

export default function Home({ deals }) {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      padding: '20px 10px', 
      maxWidth: '1100px', 
      margin: '0 auto', /* ✅ THIS CENTERS THE GRID IN THE IFRAME */
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <Head>
        <title>Don Chepito Curated Deals</title>
        <meta name="description" content="Ofertas seleccionadas a mano para ti." />
      </Head>
      
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        
        @media (min-width: 900px) {
          .deals-container {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 20px !important;
            overflow-x: visible !important;
            padding-bottom: 10px !important;
            justify-items: center; /* ✅ Centers items in their grid cells */
          }
        }
      `}</style>

      <header style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', marginTop: '10px' }}>
          🔥 Don Chepito Deals
        </h1>
        <p style={{ color: '#555' }}>
          Desliza para descubrir ofertas seleccionadas a mano.
        </p>
      </header>

      {deals.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777', fontWeight: '500' }}>El inventario se está actualizando. Vuelve pronto.</p>
      ) : (
        <div 
          className="hide-scroll deals-container"
          style={{ 
          display: 'flex', 
          gap: '16px', 
          overflowX: 'auto', 
          scrollSnapType: 'x mandatory', 
          paddingBottom: '20px', 
          scrollbarWidth: 'none', 
          WebkitOverflowScrolling: 'touch',
          width: '100%',
          justifyContent: 'flex-start'
        }}>
          {deals.map((deal) => (
            <article key={deal.id} style={{ 
              flex: '0 0 85%', 
              background: 'white', 
              border: '1px solid #e5e7eb', 
              borderRadius: '12px', 
              padding: '15px', 
              textAlign: 'center', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              scrollSnapAlign: 'center',
              minWidth: '220px',
              width: '100%'
            }}>
              <div>
                {deal.image_url && (
                  <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', marginBottom: '12px' }}>
                    <img 
                      src={deal.image_url} 
                      alt={deal.title || 'Oferta Exclusiva'} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', borderBottom: '1px solid #f3f4f6' }}
                    />
                  </div>
                )}
                <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0', color: '#1a1a1a' }}>
                  {deal.title}
                </h3>
                <p style={{ color: '#900C3F', fontWeight: 'bold', fontSize: '18px', margin: '0 0 12px 0' }}>
                  ${deal.price}
                </p>
              </div>
              <a href={deal.link_url} target="_blank" rel="noopener noreferrer nofollow" style={{ display: 'block', background: '#EEC942', color: '#000', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', transition: 'opacity 0.2s' }}>
                Ver en Amazon
              </a>
            </article>
          ))}
        </div>
      )}
      
      <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '5px' }}>
        👉 Desliza para ver más ofertas
      </p>
    </div>
  );
}
