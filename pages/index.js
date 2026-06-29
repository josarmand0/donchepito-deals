import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getServerSideProps() {
  const { data: deals } = await supabase
    .from('donchepito_curated')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12);

  return { props: { deals } };
}

export default function Home({ deals }) {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <Head>
        <title>Don Chepito Curated Deals</title>
      </Head>
      
      <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', textAlign: 'center', marginTop: '10px' }}>
        🔥 Don Chepito Deals
      </h1>
      <p style={{ textAlign: 'center', color: '#555', marginBottom: '30px' }}>
        Ofertas seleccionadas a mano para ti.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {deals.map((deal) => (
          <div key={deal.id} style={{ background: 'white', border: '1px solid #e5e7eb', border-radius: '12px', padding: '15px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <img src={deal.image_url} alt={deal.title} style={{ width: '100%', height: '160px', objectFit: 'contain', borderBottom: '1px solid #f3f4f6', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0', color: '#1a1a1a', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{deal.title}</h3>
            <p style={{ color: '#900C3F', fontWeight: 'bold', fontSize: '18px', margin: '0 0 12px 0' }}>${deal.price}</p>
            <a href={deal.link_url} target="_blank" rel="nofollow" style={{ display: 'block', background: '#EEC942', color: '#000', textDecoration: 'none', padding: '10px', borderRadius: '8px', fontWeight: '700', fontSize: '13px' }}>
              Ver en Amazon
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
