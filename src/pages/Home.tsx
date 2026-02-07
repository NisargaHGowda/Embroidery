import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BedDouble as Needle, Heart, ShoppingBag, MessageCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Nature Embroidery - Custom Handmade Designs</title>
        <meta name="description" content="Discover beautifully handcrafted embroidery designs tailored to your needs." />
        <meta name="keywords" content="embroidery, custom embroidery, handmade designs, custom stitching" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/embroidery-bg.jpg")' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Custom Embroidery Designs</h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8">Transform your ideas into beautiful embroidered creations</p>
          <Link
            to="/designs"
            className="bg-purple-600 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Browse Designs
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose Us?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: <Needle className="w-8 h-8 text-purple-600" />, title: 'Custom Designs', desc: 'Tailored professional quality embroidery' },
              { icon: <Heart className="w-8 h-8 text-purple-600" />, title: 'Handcrafted Care', desc: 'Created with attention to detail' },
              { icon: <ShoppingBag className="w-8 h-8 text-purple-600" />, title: 'Easy Ordering', desc: 'Secure ordering & fast delivery' },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6">
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
