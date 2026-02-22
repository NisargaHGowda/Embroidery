import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

type RawDesign = {
  id: string;
  design_code?: string | null;
  name?: string | null;
  image_url?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  price?: number | null;
};

const DesignDetail = () => {
  const { designId } = useParams();
  const [design, setDesign] = useState<Design | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [zoom, setZoom] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchDesign = async () => {
      if (!designId) return;
      setLoading(true);
      setErrorMessage("");
      const { data, error } = await supabase
        .from("designs")
        .select("*")
        .eq("id", designId)
        .single();

      if (error) {
        console.error("Error fetching design:", error);
        setDesign(null);
        setErrorMessage("Unable to load this design.");
        setLoading(false);
        return;
      }

      const item = (data ?? null) as RawDesign | null;
      if (!item) {
        setDesign(null);
        setLoading(false);
        return;
      }

      const price = Number(item.price ?? 0);
      const minPrice = Number(item.min_price ?? price);
      const maxPrice = Number(item.max_price ?? minPrice);

      setDesign({
        id: item.id,
        design_code: item.design_code || item.name || "Design",
        image_url: item.image_url || "/images/logo.png",
        min_price: minPrice,
        max_price: maxPrice,
      });
      setLoading(false);
    };
    fetchDesign();
  }, [designId]);

  const handleAddToCart = () => {
    if (!design) return;
    addToCart({
      id: design.id,
      name: design.design_code,
      image_url: design.image_url,
      quantity: 1,
    });
    alert(`${design.design_code} added to cart`);
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-12">Loading design...</div>;
  }

  if (!design) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <p className="mb-4">{errorMessage || "Design not found."}</p>
        <Link to="/designs" className="text-purple-700 underline">
          Back to Designs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div
            className="relative aspect-square bg-gray-100 overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setZoom({ x, y });
            }}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              src={design.image_url}
              alt={design.design_code}
              className="w-full h-full object-contain transition-transform duration-200"
              style={{
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                transform: isZoomed ? "scale(2)" : "scale(1)",
              }}
            />
          </div>
          <p className="text-xs text-gray-500 px-4 py-3">
            Hover to zoom for stitch and detail preview
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm uppercase tracking-wide text-purple-700 font-semibold">
            Design Details
          </p>
          <h1 className="text-3xl font-bold mt-2">{design.design_code}</h1>
          <p className="text-lg text-gray-700 mt-3">
            {formatPrice(design.min_price)} - {formatPrice(design.max_price)}
          </p>

          <div className="mt-6 space-y-3 text-gray-600 leading-relaxed">
            <p>
              This embroidery pattern is prepared for clean neckline placement
              and blouse panel finishing.
            </p>
            <p>
              Best suited for festive blouses, designer sleeves, and boutique
              custom orders.
            </p>
            <p>
              Final production details like thread combination and stitch
              density can be finalized during order confirmation.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="px-5 py-3 rounded-lg bg-purple-700 text-white font-semibold hover:bg-purple-800 transition"
            >
              Add to Cart
            </button>
            <a
              href={`https://wa.me/8722258273?text=Hi, I need details for ${design.design_code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition text-center"
            >
              Ask on WhatsApp
            </a>
          </div>

          <Link to="/designs" className="inline-block mt-6 text-purple-700 hover:underline">
            Back to all designs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DesignDetail;
