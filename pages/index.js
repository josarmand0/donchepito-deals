import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function getServerSideProps() {
  const { data: deals, error } = await supabase
    .from('ElNeoYorkinDeals')
    .select('*')
    .order('id', { ascending: false })

  return {
    props: {
      deals: deals || [],
    },
  }
}

export default function Home({ deals }) {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {deals.map((deal) => (
          <div key={deal.id || deal.asin} style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div>
              {deal.image_url && (
                <img src={deal.image_url} alt={deal.title || 'Oferta'} style={{ width: '100%', height: '160px', objectFit: 'contain', marginBottom: '12px' }} />
              )}
              <h3 style={{ fontSize: '14px', fontWeight: '700', margin: '0 0 8px 0', color: '#1a1a1a', minHeight: '40px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {deal.title}
              </h3>
              <p style={{ color: '#900C3F', fontWeight: 'bold', fontSize: '18px', margin: '0 0 12px 0' }}>
                {deal.price}
              </p>
            </div>
            <a href={deal.link_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', textAlign: 'center', backgroundColor: '#f59e0b', color: '#fff', padding: '10px 0', borderRadius: '8px', fontWeight: '600', textDecoration: 'none' }}>
              Ver Oferta en Amazon
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
