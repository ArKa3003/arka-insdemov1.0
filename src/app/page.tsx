export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-arka-navy text-white py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Arka Insurance</h1>
          <nav className="flex gap-6 font-body text-sm">
            <a href="#" className="hover:text-arka-teal transition-colors">Dashboard</a>
            <a href="#" className="hover:text-arka-teal transition-colors">Claims</a>
            <a href="#" className="hover:text-arka-teal transition-colors">Policies</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="animate-fadeUp">
          <h2 className="font-display text-5xl font-bold text-arka-navy mb-4">
            Premium Healthcare SaaS
          </h2>
          <p className="font-body text-xl text-slate-600 mb-8 max-w-2xl">
            Streamline your insurance operations with our modern, intuitive platform 
            designed for the healthcare industry.
          </p>
        </div>

        {/* Color Palette Demo */}
        <section className="mt-16 animate-fadeIn">
          <h3 className="font-display text-2xl font-semibold text-arka-navy mb-6">
            Design System Colors
          </h3>
          
          {/* Primary Colors */}
          <div className="mb-8">
            <p className="font-body text-sm text-slate-500 mb-3 uppercase tracking-wide">Primary</p>
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg bg-arka-blue shadow-lg"></div>
                <span className="font-mono text-xs mt-2 text-slate-600">arka-blue</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg bg-arka-navy shadow-lg"></div>
                <span className="font-mono text-xs mt-2 text-slate-600">arka-navy</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg bg-arka-teal shadow-lg"></div>
                <span className="font-mono text-xs mt-2 text-slate-600">arka-teal</span>
              </div>
            </div>
          </div>

          {/* Accent Colors */}
          <div className="mb-8">
            <p className="font-body text-sm text-slate-500 mb-3 uppercase tracking-wide">Accent</p>
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg bg-arka-green shadow-lg"></div>
                <span className="font-mono text-xs mt-2 text-slate-600">arka-green</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg bg-arka-amber shadow-lg"></div>
                <span className="font-mono text-xs mt-2 text-slate-600">arka-amber</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-lg bg-arka-red shadow-lg"></div>
                <span className="font-mono text-xs mt-2 text-slate-600">arka-red</span>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Demo */}
        <section className="mt-16 animate-slideIn">
          <h3 className="font-display text-2xl font-semibold text-arka-navy mb-6">
            Typography
          </h3>
          <div className="space-y-4 bg-white rounded-xl p-8 shadow-sm">
            <p className="font-display text-3xl font-bold text-arka-navy">
              Plus Jakarta Sans - Display Font
            </p>
            <p className="font-body text-lg text-slate-700">
              Inter - Body text for excellent readability across all devices and screen sizes.
            </p>
            <p className="font-mono text-sm text-slate-600 bg-slate-100 p-3 rounded">
              JetBrains Mono - const policyId = &quot;POL-2024-001&quot;;
            </p>
          </div>
        </section>

        {/* Button Demo */}
        <section className="mt-16">
          <h3 className="font-display text-2xl font-semibold text-arka-navy mb-6">
            Interactive Elements
          </h3>
          <div className="flex gap-4 flex-wrap">
            <button className="px-6 py-3 bg-arka-blue text-white font-body font-medium rounded-lg hover:bg-arka-blue/90 transition-colors">
              Primary Action
            </button>
            <button className="px-6 py-3 bg-arka-green text-white font-body font-medium rounded-lg hover:bg-arka-green/90 transition-colors">
              Approve Claim
            </button>
            <button className="px-6 py-3 bg-arka-red text-white font-body font-medium rounded-lg hover:bg-arka-red/90 transition-colors">
              Deny Request
            </button>
            <button className="px-6 py-3 bg-arka-amber text-arka-navy font-body font-medium rounded-lg hover:bg-arka-amber/90 transition-colors">
              Pending Review
            </button>
          </div>
        </section>

        {/* Animation Demo */}
        <section className="mt-16 mb-16">
          <h3 className="font-display text-2xl font-semibold text-arka-navy mb-6">
            Animations
          </h3>
          <div className="flex gap-6 flex-wrap">
            <div className="w-32 h-32 bg-arka-teal rounded-lg animate-pulse-subtle flex items-center justify-center">
              <span className="text-white font-mono text-xs">pulse-subtle</span>
            </div>
            <div className="w-32 h-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded-lg animate-shimmer flex items-center justify-center">
              <span className="text-slate-500 font-mono text-xs">shimmer</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-arka-navy text-white py-8 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-body text-sm text-slate-400">
            Arka Insurance Demo v1.0 - Next.js 14 + TypeScript + Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
