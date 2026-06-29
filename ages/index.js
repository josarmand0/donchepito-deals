import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

// Connect to Supabase using the Environment Variables we will set in Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getServerSideProps() {
  const { data: deals } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return { props: { deals } };
}

export default function Home({ deals }) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <Head>
        <title>Don Chepito Deals</title>
      </Head>
      
      <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a1a1a', textAlign: 'center' }}>
        🔥 Don Chepito Deals
      </h1>
      <p style={{ textAlign: 'center', color: '#555', marginBottom: '30px' }}>
        Actualizado en tiempo real desde Amazon.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {deals.map((deal) => (
          <div key={deal.id} style={{ background: 'white', borderRadius: '16px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <img src={deal.image_url} alt={deal.title} style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: '8px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginTop: '10px' }}>{deal.title.substring(0, 60)}...</h3>
            <p style={{ color: '#900C3F', fontWeight: 'bold', fontSize: '18px' }}>${deal.price}</p>
            <a href={deal.link_url} target="_blank" rel="nofollow" style={{ display: 'block', background: '#EEC942', color: '#000', textAlign: 'center', padding: '12px', borderRadius: '8px', fontWeight: '700', textDecoration: 'none' }}>
              Ver en Amazon
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
