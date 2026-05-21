import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck, Package, WashingMachine, Building2, BarChart3, FileText,
  CheckCircle2, ArrowRight, Sparkles, Zap, Shield, TrendingUp,
} from 'lucide-react';

const features = [
  { icon: Truck, title: 'Supplier Management', description: 'Manage suppliers, track procurement, and optimize supply chain operations efficiently.' },
  { icon: Package, title: 'Inventory Management', description: 'Real-time stock monitoring, automated alerts, and material tracking across all outlets.' },
  { icon: WashingMachine, title: 'Laundry Operations', description: 'Track washing processes, machine status, and service schedules in real-time.' },
  { icon: Building2, title: 'Franchise Monitoring', description: 'Monitor all franchise outlets, contracts, and royalty payments from one dashboard.' },
  { icon: BarChart3, title: 'KPI Dashboard', description: 'Comprehensive analytics with real-time KPI monitoring and performance insights.' },
  { icon: FileText, title: 'Reporting & Analytics', description: 'Generate operational and financial reports with export to PDF and Excel.' },
];

const stats = [
  { value: '10+', label: 'Franchise Outlets', icon: Building2 },
  { value: '95%', label: 'Stock Accuracy', icon: Package },
  { value: '40%', label: 'Faster Procurement', icon: Zap },
  { value: '24/7', label: 'Real-time Monitoring', icon: BarChart3 },
];

const aboutPoints = [
  'Standardized franchise operations across all outlets',
  'Real-time monitoring of outlet performance and KPIs',
  'Efficient supply chain and inventory management',
  'Quality control and service standardization',
];

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
}

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();
  const numericEnd = parseInt(end) || 0;

  useEffect(() => {
    if (!isInView || numericEnd === 0) return;
    let start = 0;
    const step = numericEnd / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericEnd) {
        setCount(numericEnd);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericEnd, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Next-Generation Laundry Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Smart Franchise</span>
                <br />
                <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
                  Laundry Management
                </span>
                <br />
                <span className="text-white">System</span>
              </h1>

              <p className="text-lg text-surface-200 mb-8 leading-relaxed max-w-lg">
                Mengintegrasikan operasional laundry, supplier, franchise, dan monitoring outlet dalam satu platform terpusat.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="group px-8 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/25 flex items-center gap-2"
                >
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  View Demo
                </a>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/5">
                {[
                  { icon: Shield, text: 'Secure' },
                  { icon: Zap, text: 'Fast' },
                  { icon: TrendingUp, text: 'Reliable' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-surface-200 text-sm">
                    <Icon className="w-4 h-4 text-primary-400" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Illustration */}
            <div className="hidden lg:block animate-float">
              <div className="relative">
                <div className="glass-card rounded-2xl p-6 space-y-4">
                  {/* Mini Dashboard */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-surface-200">WashHub Dashboard</span>
                  </div>

                  {/* KPI Row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Revenue', value: 'Rp 45M', color: 'from-primary-500 to-primary-600' },
                      { label: 'Orders', value: '1,250', color: 'from-accent-500 to-accent-600' },
                      { label: 'Outlets', value: '12', color: 'from-emerald-500 to-emerald-600' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="rounded-xl p-3 bg-white/5 border border-white/5">
                        <p className="text-[10px] text-surface-200 mb-1">{label}</p>
                        <p className={`text-lg font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart placeholder */}
                  <div className="rounded-xl bg-white/5 border border-white/5 p-4 h-32 flex items-end justify-between gap-1">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-primary-500 to-accent-500 rounded-t-sm opacity-70"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>

                  {/* Activity */}
                  <div className="space-y-2">
                    {['New order from Outlet Jakarta', 'Inventory restocked - Bandung', 'Machine #3 maintenance done'].map((text, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-surface-200 py-1.5 px-2 rounded-lg bg-white/3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Glow effects */}
                <div className="absolute -z-10 top-4 left-4 right-4 bottom-4 bg-gradient-to-br from-primary-500/20 to-accent-500/20 blur-2xl rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything You Need to Manage</h2>
            <p className="text-surface-200 max-w-2xl mx-auto">Comprehensive tools designed to streamline every aspect of your laundry franchise operations.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const [ref, isInView] = useInView(0.1);
              return (
                <div
                  key={feature.title}
                  ref={ref}
                  className={`glass-card rounded-2xl p-6 group transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-surface-200 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-4">About WashHub</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Transforming Franchise Laundry Operations</h2>
              <p className="text-surface-200 mb-8 leading-relaxed">
                WashHub is designed to standardize and optimize franchise laundry operations across all outlets. Our platform provides centralized control, real-time monitoring, and data-driven insights.
              </p>

              <div className="space-y-4">
                {aboutPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-surface-200">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Centralized Control', desc: 'One platform for all outlets', color: 'from-primary-500 to-primary-600' },
                { title: 'Real-time Data', desc: 'Live performance tracking', color: 'from-accent-500 to-accent-600' },
                { title: 'Smart Analytics', desc: 'AI-driven insights', color: 'from-emerald-500 to-emerald-600' },
                { title: 'Scalable System', desc: 'Grow with confidence', color: 'from-amber-500 to-amber-600' },
              ].map((item) => (
                <div key={item.title} className="glass-card rounded-2xl p-5 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${item.color} opacity-20 mb-3`} />
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-xs text-surface-200">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-6 text-center group">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
                  <stat.icon className="w-7 h-7 text-primary-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
                  {stat.value.includes('%')
                    ? <AnimatedCounter end={stat.value.replace('%', '')} suffix="%" />
                    : stat.value.includes('+')
                    ? <AnimatedCounter end={stat.value.replace('+', '')} suffix="+" />
                    : stat.value
                  }
                </p>
                <p className="text-sm text-surface-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Transform Your Laundry<br />Franchise Management
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Join leading laundry franchises that trust WashHub for their daily operations and growth.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/login"
                  className="px-8 py-3.5 bg-white text-primary-600 font-semibold rounded-xl hover:bg-white/90 transition-all hover:shadow-xl"
                >
                  Start Free Trial
                </Link>
                <a
                  href="#contact"
                  className="px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
