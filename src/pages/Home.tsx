import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BedDouble as Needle, Heart, ShoppingBag, MessageCircle } from 'lucide-react';

const blouseShots = [
  {
    title: "Back Neck Floral Frame",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Sleeve Border Motif Work",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Bridal Blouse Thread Detail",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  },
];

const instagramAds = [
  "https://www.instagram.com/reel/DUNgSQrEiES/",
  "https://www.instagram.com/p/C6sr8uFrU-E/",
  "https://www.instagram.com/p/C6snBM1rmFX/",
  "https://www.instagram.com/p/C6spFw8LkFH/",
];

const studioVideos = [
  {
    src: "/videos/thread-to-trend.mp4",
    caption: "From thread to trend: custom computer embroidery blouse work in progress.",
  },
  {
    src: "/videos/work-mode-on.mp4",
    caption: "Work mode on: precision finishing for bridal blouse orders and enquiries.",
  },
];

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Nature Embroidery - Custom Handmade Designs</title>
        <meta name="description" content="Discover beautifully handcrafted embroidery designs tailored to your needs." />
        <meta name="keywords" content="embroidery, custom embroidery, handmade designs, custom stitching" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[520px] md:h-[650px] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/embroidery-bg.jpg")' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <p className="uppercase tracking-[0.2em] text-xs md:text-sm text-purple-200 mb-4">
            Boutique Embroidery Studio
          </p>
          <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6">Custom Embroidery Designs</h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Transform your ideas into premium blouse and neckline embroidery with artisan finishing.
          </p>
          <Link
            to="/designs"
            className="bg-purple-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Browse Designs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose Us?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: <Needle className="w-8 h-8 text-purple-600" />, title: 'Custom Designs', desc: 'Tailored professional quality embroidery' },
              { icon: <Heart className="w-8 h-8 text-purple-600" />, title: 'Handcrafted Care', desc: 'Created with attention to detail' },
              { icon: <ShoppingBag className="w-8 h-8 text-purple-600" />, title: 'Easy Ordering', desc: 'Secure ordering & fast delivery' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition animate-fade-in-up" style={{ animationDelay: `${idx * 120}ms` }}>
                <div className="w-14 h-14 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-purple-700 font-semibold">Real Work Preview</p>
              <h2 className="text-2xl md:text-3xl font-bold">Designs Implemented on Blouses</h2>
            </div>
            <Link to="/designs" className="text-purple-700 font-semibold hover:underline">
              View all designs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blouseShots.map((shot, idx) => (
              <div
                key={shot.title}
                className="group rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-fade-in-up"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={shot.image}
                    alt={shot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-lg">{shot.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Production-level sample shot for styling and placement reference.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.15em] text-purple-700 font-semibold">
                Instagram Ads
              </p>
              <h2 className="text-2xl md:text-3xl font-bold">Watch Design Videos</h2>
            </div>
            <a
              href="https://www.instagram.com/nature__embroidery_0203?igsh=MTQwb2ZsNmc0c2gyZQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 font-semibold hover:underline"
            >
              Follow on Instagram
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instagramAds.map((link, idx) => (
              <div
                key={link}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${idx * 120}ms` }}
              >
                <iframe
                  title={`Instagram video ${idx + 1}`}
                  src={`${link}embed`}
                  className="w-full h-[560px] md:h-[600px] border-0"
                  loading="lazy"
                  allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
                <div className="p-4 border-t border-gray-100">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-700 font-semibold hover:underline"
                  >
                    Open this post on Instagram
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.15em] text-purple-700 font-semibold">
              Studio Highlights
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">Behind The Scenes Videos</h2>
            <p className="text-gray-600 mt-2">
              See the embroidery workflow from design setup to stitching precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {studioVideos.map((video, idx) => (
              <div
                key={video.src}
                className="rounded-2xl overflow-hidden bg-white border border-purple-100 shadow-md hover:shadow-xl transition animate-fade-in-up"
                style={{ animationDelay: `${idx * 140}ms` }}
              >
                <div className="relative">
                  <video
                    className="w-full h-[340px] md:h-[420px] object-cover"
                    src={video.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => {
                      e.currentTarget.muted = false;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.muted = true;
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="px-5 py-4">
                  <p className="text-gray-800 leading-relaxed">{video.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-700 text-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="mb-6 md:mb-8">Contact us today to discuss your embroidery needs</p>
          <Link
            to="/contact"
            className="inline-flex items-center bg-white text-purple-700 px-6 py-2 md:px-6 md:py-3 rounded-lg text-lg font-semibold hover:bg-purple-100 transition duration-300"
          >
            <MessageCircle className="mr-2" />
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
