import { useState, useEffect } from 'react';
import { ECUADOR_PRODUCTS } from './ecuadorProducts';
import { AgroProduct } from '../types';

const STORAGE_KEY = 'sai_custom_products_v1';

let serverProductsCache: AgroProduct[] | null = null;

export function getCustomProducts(): AgroProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading custom products', e);
    return [];
  }
}

export function getAllProducts(): AgroProduct[] {
  if (serverProductsCache && serverProductsCache.length > 0) {
    return serverProductsCache;
  }
  const custom = getCustomProducts();
  const customIds = new Set(custom.map((p) => p.id));
  const baseFiltered = ECUADOR_PRODUCTS.filter((p) => !customIds.has(p.id));
  return [...custom, ...baseFiltered];
}

export async function syncProductsWithServer(): Promise<AgroProduct[]> {
  try {
    const localCustoms = getCustomProducts();

    const res = await fetch('/api/products');
    if (res.ok) {
      const serverProds: AgroProduct[] = await res.json();
      serverProductsCache = serverProds;

      // If there are local custom products not present in server list, sync them to server
      if (localCustoms.length > 0) {
        const serverIds = new Set(serverProds.map((p) => p.id));
        for (const lc of localCustoms) {
          if (!serverIds.has(lc.id)) {
            try {
              await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product: lc }),
              });
            } catch (err) {
              console.error('Error auto-syncing local product to server:', err);
            }
          }
        }
      }

      window.dispatchEvent(new Event('sai_products_updated'));
      return serverProds;
    }
  } catch (e) {
    console.error('Error syncing products with server:', e);
  }
  return getAllProducts();
}

export function saveProductToStore(product: AgroProduct): AgroProduct[] {
  const custom = getCustomProducts();
  const index = custom.findIndex((p) => p.id === product.id);

  if (index >= 0) {
    custom[index] = product;
  } else {
    custom.unshift(product);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error('Error saving product to localStorage', e);
  }

  if (serverProductsCache) {
    const sIndex = serverProductsCache.findIndex((p) => p.id === product.id);
    if (sIndex >= 0) {
      serverProductsCache[sIndex] = product;
    } else {
      serverProductsCache.unshift(product);
    }
  }

  window.dispatchEvent(new Event('sai_products_updated'));

  // Sync to backend server
  fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.products) {
        serverProductsCache = data.products;
        window.dispatchEvent(new Event('sai_products_updated'));
      }
    })
    .catch((err) => console.error('Error syncing saved product to server API:', err));

  return getAllProducts();
}

export function deleteProductFromStore(id: string): AgroProduct[] {
  const custom = getCustomProducts();
  const filtered = custom.filter((p) => p.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting product from localStorage', e);
  }

  if (serverProductsCache) {
    serverProductsCache = serverProductsCache.filter((p) => p.id !== id);
  }

  window.dispatchEvent(new Event('sai_products_updated'));

  // Sync delete to backend server
  fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data?.products) {
        serverProductsCache = data.products;
        window.dispatchEvent(new Event('sai_products_updated'));
      }
    })
    .catch((err) => console.error('Error deleting product on server API:', err));

  return getAllProducts();
}

export function useProducts() {
  const [products, setProducts] = useState<AgroProduct[]>(() => getAllProducts());

  useEffect(() => {
    syncProductsWithServer().then((p) => {
      if (p && p.length > 0) setProducts(p);
    });

    const handleUpdate = () => {
      setProducts(getAllProducts());
    };

    window.addEventListener('sai_products_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    const interval = setInterval(() => {
      syncProductsWithServer();
    }, 12000);

    return () => {
      window.removeEventListener('sai_products_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  return products;
}
