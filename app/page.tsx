
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  affiliate_url: string;
  category: string | null;
  image_url: string | null;
}

async function getProducts(): Promise<Product[]> {
  "use cache";

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase Error Details:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return [];
  }

  return (data ?? []) as Product[];
}

function getBillingDetails(name: string) {
  if (name.includes('Launch Hosting')) {
    return {
      billing: 'Billed annually',
      renewal: 'Renews at R79/month',
    };
  }

  if (name.includes('Starter Hosting')) {
    return {
      billing: 'Billed annually',
      renewal: 'Renews at R148/month',
    };
  }

  return null;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(price);
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            DealSniper 🔫
          </h1>
          <p className="mt-2 text-gray-600">
            Curated deals. Track prices. Earn commissions.
          </p>
        </header>

        <p className="mb-6 text-sm text-gray-600">
          Some links are affiliate links. We may earn a commission if
          you purchase through them, at no extra cost to you.
        </p>

        {products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No products found. Add some via Supabase Dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const details = getBillingDetails(product.name);

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gray-200 text-gray-500">
                      Image coming soon
                    </div>
                  )}

                  <div className="p-5">
                    <p className="text-sm font-medium text-blue-700">
                      {product.category || 'Featured offer'}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-gray-900">
                      {product.name}
                    </h2>

                    <p className="mt-3 text-2xl font-bold text-green-700">
                      {formatPrice(product.price)}
                      <span className="ml-1 text-sm font-normal text-gray-600">
                        /month*
                      </span>
                    </p>

                    {details && (
                      <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                        <p>{details.billing}</p>
                        <p className="mt-1 font-medium">
                          {details.renewal}
                        </p>
                      </div>
                    )}

                    <a
                      href={product.affiliate_url}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="mt-5 block w-full rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Offer
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-gray-500">
          *Prices and promotional terms may change. Check the
          provider&apos;s website for current pricing and billing terms.
        </footer>
      </div>
    </main>
  );
}
