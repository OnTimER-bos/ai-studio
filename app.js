const { useState, useEffect } = React;

// Komponen Ikon Lucide untuk React
const LucideIcon = ({ name, size = 20, className = "" }) => {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [name]);
    return <i data-lucide={name} className={className} style={{ width: size, height: size }}></i>;
};

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState(null);
    
    const apiKey = ""; // Kunci API otomatis

    const models = {
        video: [
            { id: 'sora-2', name: 'Sora 2', provider: 'OpenAI', desc: 'Realistis & Sinematik' },
            { id: 'veo-3', name: 'Veo 3', provider: 'Google', desc: 'Presisi Tinggi' }
        ],
        image: [
            { id: 'flux-2', name: 'Flux.2', provider: 'Black Forest', desc: 'Fotorealistik' },
            { id: 'dalle-3', name: 'DALL-E 3', provider: 'OpenAI', desc: 'Akurat' }
        ],
        text: [
            { id: 'gemini-2-5', name: 'Gemini 2.5', provider: 'Google', desc: 'Super Cepat' }
        ]
    };

    const handleGenerate = async (type) => {
        if (!prompt) return;
        setLoading(true);
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Generate a creative response for: ${prompt}` }] }]
                })
            });
            const data = await response.json();
            const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, terjadi kesalahan.";
            setResult({ type, text: output });
        } catch (err) {
            console.error("Gagal memproses AI:", err);
        } finally {
            setLoading(false);
        }
    };

    const SidebarItem = ({ id, icon, label }) => (
        <button 
            onClick={() => { setActiveTab(id); setResult(null); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all mb-1 ${
                activeTab === id ? 'sidebar-item-active' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
        >
            <LucideIcon name={icon} size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0c]">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 flex flex-col p-4 space-y-8 bg-[#0d0d0f]">
                <div className="flex items-center space-x-3 px-2">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-600/20">
                        <LucideIcon name="sparkles" className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">V-STUDIO</h1>
                </div>

                <nav className="flex-1">
                    <SidebarItem id="dashboard" icon="layout-grid" label="Dashboard" />
                    <SidebarItem id="video" icon="video" label="AI Video" />
                    <SidebarItem id="image" icon="image" label="AI Image" />
                    <SidebarItem id="text" icon="type" label="AI Writing" />
                </nav>
                
                <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">Kredit Sisa</span>
                        <LucideIcon name="zap" size={14} className="text-yellow-400" />
                    </div>
                    <div className="text-lg font-bold">1,240 <span className="text-xs font-normal text-gray-500">Pts</span></div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 glass-panel sticky top-0 z-10">
                    <div className="relative w-96">
                        <LucideIcon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input type="text" placeholder="Cari alat AI..." className="w-full bg-gray-900 border border-gray-800 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="bg-white text-black px-5 py-1.5 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">Upgrade Pro</button>
                        <div className="w-8 h-8 rounded-full bg-indigo-500 border border-white/10"></div>
                    </div>
                </header>

                <div className="p-8 animate-fade-in">
                    {activeTab === 'dashboard' ? (
                        <div className="space-y-8">
                            <section>
                                <h2 className="text-4xl font-bold mb-3 tracking-tight">Halo, Kreator!</h2>
                                <p className="text-gray-400 text-lg">Wujudkan ide Anda menjadi kenyataan dengan kekuatan AI.</p>
                            </section>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Talking Avatar", icon: "monitor-play", color: "bg-blue-600", desc: "Ubah foto menjadi video bicara otomatis." },
                                    { title: "AI Hugging", icon: "users", color: "bg-purple-600", desc: "Buat video interaksi sosial yang nyata." },
                                    { title: "Smart Ads", icon: "sparkles", color: "bg-orange-600", desc: "Generator konten iklan produk instan." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-[#151518] p-6 rounded-3xl border border-gray-800 hover:border-indigo-500/50 transition-all cursor-pointer group">
                                        <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                            <LucideIcon name={item.icon} className="text-white" size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold capitalize mb-2">AI {activeTab} Studio</h2>
                                <p className="text-gray-400 text-sm">Pilih model dan deskripsikan apa yang ingin Anda buat.</p>
                            </div>

                            <div className="bg-[#151518] p-8 rounded-3xl border border-gray-800 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Prompt Anda</label>
                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={`Tulis deskripsi detail untuk ${activeTab} di sini...`}
                                        className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-5 h-40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-lg"
                                    />
                                </div>
                                <button 
                                    onClick={() => handleGenerate(activeTab)}
                                    disabled={loading || !prompt}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all text-lg shadow-lg shadow-indigo-600/10"
                                >
                                    {loading ? <LucideIcon name="loader-2" className="animate-spin" /> : <LucideIcon name="zap" />}
                                    <span>{loading ? 'Sedang Memproses...' : `Generate ${activeTab}`}</span>
                                </button>
                            </div>

                            {result && (
                                <div className="bg-[#151518] p-8 rounded-3xl border border-indigo-500/30 animate-fade-in shadow-2xl shadow-indigo-500/5">
                                    <div className="flex items-center space-x-2 text-indigo-400 font-bold mb-4 text-xs tracking-widest uppercase">
                                        <LucideIcon name="check-circle" size={14} />
                                        <span>Hasil Generasi AI</span>
                                    </div>
                                    <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">{result.text}</div>
                                    <div className="mt-8 flex gap-4">
                                        <button className="flex-1 bg-white text-black font-bold py-3 rounded-xl text-sm hover:bg-gray-200 transition-colors">Unduh Hasil</button>
                                        <button className="flex-1 border border-gray-700 font-bold py-3 rounded-xl text-sm hover:bg-gray-800 transition-colors">Salin Teks</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
