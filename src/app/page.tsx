"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginPageComponent } from '@/components/custom/LoginPageComponent';
import { SignupPageComponent } from '@/components/custom/SignupPageComponent';
import { Wheat, Store, Search, Handshake, Truck, Leaf, Fish, Milk, Star, ArrowRight, CheckCircle, Zap } from 'lucide-react';

function IntroAnimation({ onFinished }: { onFinished: () => void }) {
    const icons = [
        <Wheat key="wheat" className="h-20 w-20 text-green-600" />,
        <Truck key="truck" className="h-20 w-20 text-gray-600" />,
        <Store key="store" className="h-20 w-20 text-orange-600" />,
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex >= icons.length) {
            const finishTimer = setTimeout(() => onFinished(), 500);
            return () => clearTimeout(finishTimer);
        }

        const timer = setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 1200);

        return () => clearTimeout(timer);
    }, [currentIndex, onFinished, icons.length]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#FBF3E5] to-[#FDFBF4] z-[100]">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {icons.map((icon, index) => (
                    <div
                        key={index}
                        className={`absolute transition-all duration-700 ${index === currentIndex ? 'opacity-100 scale-110 animate-bounce' : 'opacity-0 scale-75'}`}
                    >
                        {icon}
                    </div>
                ))}
            </div>
        </div>
    );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modal = searchParams.get('modal');

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.push('/');
    }
  };

  const categories = [
    { name: "Grains & Flours", icon: <Wheat className="h-8 w-8 text-yellow-600"/>, color: "bg-gradient-to-br from-yellow-100 to-yellow-200", borderColor: "hover:border-yellow-300" },
    { name: "Spices & Seasonings", icon: <Leaf className="h-8 w-8 text-red-600"/>, color: "bg-gradient-to-br from-red-100 to-red-200", borderColor: "hover:border-red-300" },
    { name: "Dairy & Cheeses", icon: <Milk className="h-8 w-8 text-blue-600"/>, color: "bg-gradient-to-br from-blue-100 to-blue-200", borderColor: "hover:border-blue-300" },
    { name: "Meat & Seafood", icon: <Fish className="h-8 w-8 text-cyan-600"/>, color: "bg-gradient-to-br from-cyan-100 to-cyan-200", borderColor: "hover:border-cyan-300" },
  ];

  const features = [
    { icon: <CheckCircle className="h-6 w-6 text-green-600" />, text: "Quality Assured Products" },
    { icon: <Zap className="h-6 w-6 text-blue-600" />, text: "Fast & Secure Delivery" },
    { icon: <Star className="h-6 w-6 text-yellow-600" />, text: "Trusted by 10,000+ Businesses" }
  ];

  const stats = [
    { number: "10,000+", label: "Active Sellers" },
    { number: "50,000+", label: "Products Listed" },
    { number: "1M+", label: "Orders Completed" },
    { number: "500+", label: "Cities Covered" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-hidden">
      {/* Enhanced Header */}
      <header className="sticky top-2 z-40 w-full border border-white/20 rounded-lg bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 mx-2">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img src="/FinalLogo-withoutBG.png" className="max-h-16 transition-transform duration-300 group-hover:scale-105" alt="Thelo" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#BEA093]/20 to-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-gray-700 hover:text-[#BEA093] hover:bg-[#BEA093]/10 transition-all duration-300" asChild>
              <Link href="/?modal=login">Login</Link>
            </Button>
            <Button className="bg-gradient-to-r from-[#BEA093] to-[#D4C4B0] hover:from-[#D4C4B0] hover:to-[#BEA093] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300" asChild>
              <Link href="/?modal=signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-[#FBF3E5] via-[#FDFBF4] to-[#F8F2E8] overflow-hidden">
        <div className="absolute inset-0 bg-[url(/FinalLogo-withoutBG.png)] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce-slow opacity-20">
          <Wheat className="h-16 w-16 text-yellow-500 rotate-12" />
        </div>
        <div className="absolute top-40 right-16 animate-float opacity-20">
          <Leaf className="h-12 w-12 text-green-500 -rotate-12" />
        </div>
        <div className="absolute bottom-32 left-20 animate-pulse opacity-20">
          <Fish className="h-14 w-14 text-blue-500 rotate-45" />
        </div>

        <section className="relative py-24 md:py-40">
          <div className="container mx-auto text-center px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                Directly from the Source.
              </h1>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-[#BEA093] via-[#D4C4B0] to-[#BEA093] bg-clip-text text-transparent mt-2 leading-tight">
                Delivered to Your Door.
              </h2>
              <p className="mt-8 max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 leading-relaxed font-medium">
                The definitive B2B marketplace for India's finest raw food materials. We bridge the gap between producers and businesses, ensuring quality, transparency, and growth.
              </p>
              
              {/* Feature Pills */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    {feature.icon}
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-6">
                <Button size="lg" className="h-14 px-10 text-lg bg-gradient-to-r from-[#BEA093] to-[#D4C4B0] hover:from-[#D4C4B0] hover:to-[#BEA093] text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group" asChild>
                  <Link href="/?modal=signup">
                    Become a Seller 
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 border-gray-300 hover:border-[#BEA093] hover:bg-[#BEA093]/10 backdrop-blur-sm bg-white/70 transform hover:-translate-y-1 transition-all duration-300 group" asChild>
                  <Link href="/dashboard/shopkeeper">
                    Browse Marketplace
                    <Search className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-16 border-t border-white/20 backdrop-blur-sm bg-white/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm md:text-base text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Categories Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-[#FDFBF4]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Explore Our Categories
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Find exactly what you need from our wide range of premium raw materials.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, index) => (
              <div 
                key={cat.name} 
                className={`p-8 rounded-2xl border border-gray-200 bg-white text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer group ${cat.borderColor} hover:border-2`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${cat.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#BEA093] transition-colors duration-300">{cat.name}</h3>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="h-5 w-5 mx-auto text-[#BEA093]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Enhanced How It Works Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-[#FBF3E5] to-[#F8F2E8] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            A Simple, Transparent Process
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Connecting buyers and sellers in just 3 easy steps.
          </p>
          <div className="mt-24 relative grid md:grid-cols-3 gap-y-20 md:gap-x-16">
            {/* Enhanced connection line */}
            <div className="hidden md:block absolute top-1/3 left-0 w-full h-1 -translate-y-8">
              <div className="w-full h-full bg-gradient-to-r from-green-300 via-blue-300 to-orange-300 rounded-full opacity-30"></div>
            </div>
            
            <div className="relative flex flex-col items-center group">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 text-green-600 mb-8 border-4 border-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Wheat className="h-12 w-12"/>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Sellers List Products</h3>
              <p className="text-gray-600 max-w-xs leading-relaxed">Sellers showcase their raw materials, complete with details, pricing, and quality standards.</p>
            </div>
            
            <div className="relative flex flex-col items-center group">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 mb-8 border-4 border-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Search className="h-12 w-12"/>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Shopkeepers Discover</h3>
              <p className="text-gray-600 max-w-xs leading-relaxed">Shopkeepers easily search, filter, and find the exact ingredients they need for their business.</p>
            </div>
            
            <div className="relative flex flex-col items-center group">
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 mb-8 border-4 border-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Handshake className="h-12 w-12"/>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Goods are Transacted</h3>
              <p className="text-gray-600 max-w-xs leading-relaxed">Secure orders are placed, payments are processed, and goods are delivered efficiently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 bg-gradient-to-br from-[#BEA093] to-[#A8906B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative">
          <div className="mb-8">
            <img src="/FinalLogo-withoutBG.png" className="max-h-20 mx-auto opacity-80" alt="Thelo" />
          </div>
          <p className="text-lg opacity-90">&copy; 2025 Thelo. A new era of B2B trade in India.</p>
          <div className="mt-8 flex justify-center space-x-8 text-sm opacity-75">
            <Link href="#" className="hover:opacity-100 transition-opacity duration-300">Privacy Policy</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity duration-300">Terms of Service</Link>
            <Link href="#" className="hover:opacity-100 transition-opacity duration-300">Support</Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Dialog open={modal === 'login'} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <LoginPageComponent />
        </DialogContent>
      </Dialog>
      <Dialog open={modal === 'signup'} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <SignupPageComponent />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Home() {
    const [showAnimation, setShowAnimation] = useState(true);

    useEffect(() => {
        const hasSeenAnimation = sessionStorage.getItem('hasSeenIntroV2');
        if (hasSeenAnimation) {
            setShowAnimation(false);
        } else {
            sessionStorage.setItem('hasSeenIntroV2', 'true');
        }
    }, []);

    const onAnimationFinish = () => {
        setShowAnimation(false);
    };

    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#FBF3E5] to-[#FDFBF4]">Loading...</div>}>
            {showAnimation && <IntroAnimation onFinished={onAnimationFinish} />}
            <div className={`transition-opacity duration-1000 ${showAnimation ? 'opacity-0' : 'opacity-100'}`}>
                <HomePageContent />
            </div>
        </Suspense>
    )
}
