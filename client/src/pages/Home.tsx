import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Suhaila Locals Blog - Main Page
 * Design Philosophy: Artisanal Storytelling
 * - Warm gold and terracotta accents
 * - Playfair Display for elegant headings
 * - Card-based blog layout with smooth hover animations
 * - Asymmetric, flowing design
 */

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "The Scents of the Souk: 5 Spices You Must Buy in Aqaba",
    excerpt: "Discover the essential spices of Jordanian cuisine found in Aqaba's souks, from tangy Sumac to the aromatic Mansaf blend...",
    date: "February 20, 2026",
    category: "Food Culture",
    image: "/manus-storage/spices-blog_a5b06f60.png",
    readTime: "5 min read",
    slug: "spices-souk"
  },
  {
    id: 2,
    title: "Discovering Aqaba: History, Culture, and Ayla",
    excerpt: "Explore the rich history of Aqaba, from the ancient Islamic city of Ayla to its unique coastal culture, traditions, and the Mamluk Fort...",
    date: "January 15, 2026",
    category: "Travel Guide",
    image: "/manus-storage/aqaba-culture_443e44f1.png",
    readTime: "8 min read",
    slug: "aqaba-history"
  },
  {
    id: 3,
    title: "Sayadieh: The Signature Seafood Dish of Aqaba",
    excerpt: "Discover Sayadieh, the traditional fish and rice dish that is the culinary heart of Aqaba. A local's guide to this flavorful Red Sea delicacy...",
    date: "December 8, 2025",
    category: "Culinary",
    image: "/manus-storage/sayadieh-dish_237f5184.png",
    readTime: "6 min read",
    slug: "sayadieh-dish"
  },
  {
    id: 4,
    title: "The Sweet Secret of Aqaba: Discovering Al-Hooh Dessert",
    excerpt: "Discover Al-Hooh, Aqaba's traditional layered dessert made with nuts, honey, and local butter. A true taste of local heritage...",
    date: "December 1, 2025",
    category: "Food Culture",
    image: "/manus-storage/spices-blog_a5b06f60.png",
    readTime: "4 min read",
    slug: "al-hooh-dessert"
  },
  {
    id: 5,
    title: "The Ultimate Local's Guide to Things to Do in Aqaba",
    excerpt: "Discover the real Aqaba with this local's guide to non-touristy things to do, including the best souks, street food, and hidden gems...",
    date: "November 25, 2025",
    category: "Travel Guide",
    image: "/manus-storage/aqaba-culture_443e44f1.png",
    readTime: "10 min read",
    slug: "locals-guide"
  }
];

export default function Home() {
  const [visiblePosts, setVisiblePosts] = useState<number[]>([]);

  useEffect(() => {
    // Stagger blog card animations
    blogPosts.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisiblePosts(prev => [...prev, index]);
      }, index * 100);
      return () => clearTimeout(timer);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img 
              src="/manus-storage/logo_0a7e901b.png" 
              alt="Suhaila Locals" 
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-bold text-[#00798C]">Suhaila Locals</h1>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#home" className="text-gray-700 hover:text-[#D4AF37] transition-colors font-medium">Home</a>
            <a href="#blog" className="text-gray-700 hover:text-[#D4AF37] transition-colors font-medium">Blog</a>
            <a href="#about" className="text-gray-700 hover:text-[#D4AF37] transition-colors font-medium">About</a>
            <a href="#contact" className="text-gray-700 hover:text-[#D4AF37] transition-colors font-medium">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/manus-storage/blog-hero_c3c7b1d8.png)',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-3xl animate-fade-in">
            <p className="text-[#D4AF37] font-semibold text-lg mb-4 tracking-wide">DISCOVER LOCAL STORIES</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Aqaba Through Local Eyes
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Stories, tips, and inspiration from Aqaba and beyond. Experience authentic travel, culinary adventures, and cultural discoveries.
            </p>
            <Button 
              className="bg-[#E76F51] hover:bg-[#d65d3f] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Explore Stories <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      {/* Blog Posts Section */}
      <section id="blog" className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#D4AF37] font-semibold text-sm tracking-widest mb-3">OUR LATEST STORIES</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
              Travel & Culinary Guides
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#D4AF37] to-[#E76F51] mx-auto" />
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article
                key={post.id}
                className={`group cursor-pointer transform transition-all duration-500 ${
                  visiblePosts.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-[#E76F51] text-white px-4 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 line-clamp-2 group-hover:text-[#00798C] transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Aqaba
                      </div>
                    </div>

                    {/* Date and CTA */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#D4AF37]">{post.date}</span>
                      <a 
                        href={`#post/${post.slug}`}
                        className="inline-flex items-center gap-2 text-[#00798C] font-semibold hover:text-[#E76F51] transition-colors group/cta"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 group-hover/cta:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-16">
            <Button 
              variant="outline"
              className="border-2 border-[#00798C] text-[#00798C] hover:bg-[#00798C] hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
            >
              View All Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#00798C] to-[#005f6e]">
        <div className="container max-w-2xl text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Connected with Aqaba Stories
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Get the latest travel tips, culinary guides, and local insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
            <Button
              className="bg-[#D4AF37] hover:bg-[#c99d2e] text-[#1A1A1A] font-bold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-gray-300 py-12 px-4">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <img 
                  src="/manus-storage/logo_0a7e901b.png" 
                  alt="Suhaila Locals" 
                  className="h-6 w-6"
                />
                Suhaila Locals
              </h3>
              <p className="text-sm text-gray-400">
                Authentic travel experiences and culinary adventures in Aqaba, Jordan.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Experiences</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Travel Guide</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Food Culture</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Local Tips</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Suhaila Locals. All rights reserved. | Discover Aqaba through local eyes.</p>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
