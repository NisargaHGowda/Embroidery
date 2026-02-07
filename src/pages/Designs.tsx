import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { formatPrice } from "../utils/formatPrice";
import { useCartStore } from "../store/cartStore";

interface Design {
  id: string;
  design_code: string;
  image_url: string;
  min_price: number;
  max_price: number;
}

const PAGE_SIZE = 6;
const MAX_PAGES = 5; // Only 5 pages until more designs are added

const Designs = () => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetchDesigns();

    // ❌ Disable right click
    const block = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, [page]);

  const fetchDesigns = async () => {
    setLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data } = await supabase
      .from("designs")
      .select("*")
      .order("design_code", { ascending: true })
      .order("id", { ascending: true })
      .range(from, to);

    if (data) setDesigns(data);
    setLoading(false);
  };

  const handleAddToCart = (design: Design) => {
    addToCart({
      id: design.id,
      name: design.design_code,
      image_url: design.image_url,
      quantity: 1,
    });

    alert(`${design.design_code} added to cart`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Embroidery Designs
      </h1>

      {loading && (
        <p className="text-center text-gray-500 mb-6">
          Loading designs...
        </p>
      )}

      <div
        key={page}
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6
          transition-opacity duration-500
          ${loading ? "opacity-0" : "opacity-100"}`}
      >
        {designs.map((design) => (
          <div
            key={design.id}
            className="bg-white rounded-lg shadow p-4 select-none"
          >
            {/* IMAGE */}
            <img
              src={design.image_url}
              alt={design.design_code}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-64 object-contain rounded
                         pointer-events-none select-none bg-gray-100"
            />

            <h3 className="mt-3 font-semibold text-lg">
              {design.design_code}
            </h3>

            <p className="text-gray-600">
              Price Range:{" "}
              {formatPrice(design.min_price)} –{" "}
              {formatPrice(design.max_price)}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Final price will be confirmed after discussion
            </p>

            {/* BUTTONS */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => handleAddToCart(design)}
                className="w-full bg-purple-600 text-white py-2 rounded
                           hover:bg-purple-700 transition"
              >
                Add to Cart
              </button>

              <a
                href={`https://wa.me/8722258273?text=Hi, I want to know the price for ${design.design_code}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-green-500 text-white py-2 rounded
                           hover:bg-green-600 transition"
              >
                Ask Price on WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded
                     disabled:opacity-50 hover:bg-gray-300"
        >
          Previous
        </button>

        <span className="px-4 py-2 font-semibold">Page {page}</span>

        <button
          disabled={page >= MAX_PAGES || designs.length < PAGE_SIZE}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded
                     disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Designs;
