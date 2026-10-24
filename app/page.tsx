import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  affiliate_url: string;
  category: string;
  image_url: string | null;
}

async function getProducts(): Promise<Product[]> {
  "use cache"; // Add this line
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Error Details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    });
    return [];
  }
  return data || [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">DealSniper 🔫</h1>
          <p className="text-gray-600 mt-2">Curated deals. Track prices. Earn commissions.</p>
        </header>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Add some via Supabase Dashboard!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                  <p className="text-2xl font-bold text-green-600 mt-2">
  {new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR'
  }).format(product.price)}
</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  
                  <div className="mt-4">
                    <a 
                      href={product.affiliate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
