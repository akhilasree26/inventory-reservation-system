"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  inventories: {
    warehouse: string;
    totalStock: number;
    reservedStock: number;
    availableStock: number;
  }[];
};

export default function HomePage() {

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProductId, setLoadingProductId] =
  useState<string | null>(null);

  const router = useRouter();

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();

    setProducts(data);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function reserveProduct(productId: string) {

    try {

      setLoadingProductId(productId);

      // get first inventory
      const product = products.find((p) => p.id === productId);

      if (!product) return;

      const inventoryRes = await fetch("/api/products");
      const inventoryData = await inventoryRes.json();

      const selectedProduct =
        inventoryData.find((p: Product) => p.id === productId);

      const inventoryId =
        selectedProduct.inventories[0]?.id;

      if (!inventoryId) {
        alert("Inventory not found");
        return;
      }

      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryId,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          alert("Not enough stock available");
        } else {
          alert(data.error || "Reservation failed");
        }
        return;
      }
      
      router.push(`/reservation/${data.id}`);

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Reservation successful!");

      fetchProducts();

    } catch (error) {
      console.error(error);

      alert("Reservation failed");

    } finally {
      setLoadingProductId(null);
    }
  }

return (
  <main className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200 p-6">

    <div className="max-w-6xl mx-auto">

      <div className="text-center mb-10">

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-lg mb-4 border border-gray-200">
          <span className="text-2xl">📦</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Inventory Reservation System
        </h1>

        <p className="mt-2 text-base text-gray-600">
          Real-time inventory availability and reservation
        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {products.map((product) => (

          <div
            key={product.id}
            className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-[28px] shadow-xl p-5 hover:-translate-y-1 transition-all duration-300"
          >

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-300 shadow-md flex items-center justify-center text-xl">
                  📱
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h2>

                  <p className="text-gray-500 mt-1 text-sm">
                    Live Inventory Tracking
                  </p>
                </div>

              </div>

              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 font-semibold text-xs shadow-sm">
                Active
              </div>

            </div>

            <div className="space-y-4">

              {product.inventories.map((inventory, index) => (

                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-100 border border-gray-200 rounded-2xl p-4 shadow-sm"
                >

                  <div className="flex justify-between items-center mb-3">

                    <div>

                      <h3 className="text-lg font-bold text-gray-800">
                        {inventory.warehouse}
                      </h3>

                      <p className="text-gray-500 text-xs mt-1">
                        Warehouse Location
                      </p>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                        inventory.availableStock > 5
                          ? "bg-green-100 text-green-700"
                          : inventory.availableStock > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {inventory.availableStock > 5
                        ? "In Stock"
                        : inventory.availableStock > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                    </span>

                  </div>

                  <div className="grid grid-cols-3 gap-3">

                    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">

                      <p className="text-gray-500 text-xs font-medium">
                        Total
                      </p>

                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {inventory.totalStock}
                      </p>

                    </div>

                    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">

                      <p className="text-gray-500 text-xs font-medium">
                        Reserved
                      </p>

                      <p className="text-2xl font-bold text-orange-500 mt-1">
                        {inventory.reservedStock}
                      </p>

                    </div>

                    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">

                      <p className="text-gray-500 text-xs font-medium">
                        Available
                      </p>

                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {inventory.availableStock}
                      </p>

                    </div>

                  </div>

                </div>
              ))}
            </div>

            <button
              onClick={() => reserveProduct(product.id)}
              disabled={loadingProductId === product.id}
              className="mt-5 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:opacity-95 text-white py-3 rounded-2xl text-base font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {loadingProductId === product.id
                ? "Processing..."
                : "Reserve 1 Item"}
            </button>

          </div>
        ))}
      </div>

      <div className="mt-10 bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-md p-4 flex flex-col md:flex-row justify-center gap-5 text-gray-700">

        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <p className="font-medium text-sm">
            Reservations valid for 10 minutes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg">⏳</span>
          <p className="font-medium text-sm">
            Auto-release after expiration
          </p>
        </div>

      </div>

    </div>
  </main>
);
}