import SeamlessIframeWrapper from '../SeamlessIframeWrapper';
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
    <SeamlessIframeWrapper>
      <main style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        padding: '20px 15px', 
        width: '100%', 
        margin: '0 auto',
        boxSizing: 'border-box'
      }}>
        <Head>
          <title>Don Chepito Curated Deals</title>
          <meta name="description" content="Ofertas seleccionadas a mano para ti." />
        </Head>
        
        {/* 1% Elite CSS Architecture: Cleanly separates Mobile Swipe from Desktop Grid */}
        <style>{`
          .deals-container {
            /* Default Mobile View: Marquee Swipe */
            display: flex;
            gap: 16px;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 20px;
            scrollbar-width: none; /* Firefox */
            -webkit-overflow-scrolling: touch;
            width: 100%;
          }
          
          /* Hide scrollbar for Chrome, Safari and Opera */
          .deals-container::-webkit-scrollbar { 
            display: none; 
          }

          .deal-card {
            flex: 0 0 85%;
            scroll-snap-align: center;
          }

          /* Desktop View: Auto-Row Grid */
          @media (min-width: 769px) {
            .deals-container {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
              gap: 20px;
              overflow-x: visible; /* Kills the swipe */
              padding-bottom: 10px;
            }
            .deal-card {
              flex: auto; /* Resets the mobile width */
            }
          }
        `}</style>

        <header style={{ textAlign: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 10px 0' }}>
            🔥 Don Chepito Deals
          </h1>
          <p style={{ color: '#555', margin: '0' }}>
            Desliza para descubrir ofertas seleccionadas a mano.
          </p>
        </header>

        {deals.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', fontWeight: '500' }}>El inventario se está actualizando. Vuelve pronto.</p>
        ) : (
          <div className="deals-container">
            {deals.map((deal) => (
              <article key={deal.id} className="deal-card" style={{ 
                background: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: '12px', 
                padding: '15px', 
                textAlign: 'center', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between'
              }}>
                <div>
                  {deal.image_url && (
                    <div style={{ width: '100%', aspectRatio: '1/1', position: 'relative', marginBottom: '12px' }}>
                      <img 
                        src={deal.image_url} 
                        alt={deal.title || 'Oferta Exclusiva'} 
                        loading="lazy"
                        decoding="async"
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
                <a href={deal.link_url} target="_blank" rel="noopener noreferrer nofollow" style={{ display: 'block', background: '#EEC942', color: '#000', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', transition: 'transform 0.2s' }}>
                  Ver en Amazon
                </a>
              </article>
            ))}
          </div>
        )}
        
        {/* Helper text only displays on smaller screens where swiping is needed */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '10px' }} className="mobile-only-text">
          👉 Desliza para ver más ofertas
        </p>

        <style>{`
          @media (min-width: 769px) {
            .mobile-only-text { display: none; }
          }
        `}</style>
      </main>
    </SeamlessIframeWrapper>
  );
}
