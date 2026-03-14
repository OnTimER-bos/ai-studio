const { useState, useEffect } = React;

/**
 * Komponen Ikon Lucide untuk React
 */
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
    const [selectedEngine, setSelectedEngine] = useState('gemini');

    // KONFIGURASI API KEY (Pastikan tidak ada spasi di awal/akhir)
    const apiKeys = {
        gemini: "AIzaSyDGj5VeZ9y7gKcsmbWrqB0_ptzoyBjHP1U".trim(),
        groq: "gsk_vR8_0BZiQWmk42bQOKH6tHNZEftZLYfpCZA0UMCyG".trim() 
    };

    /**
     * Fungsi Pemanggil Gemini menggunakan API v1 (Stable)
     */
    const callGeminiAPI = async (text) => {
        // Menggunakan v1 (BUKAN v1beta) untuk stabilitas maksimum
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKeys.gemini}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: text }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            // Jika v1 gagal, coba v1beta sebagai cadangan otomatis
            console.warn("v1 Gagal, mencoba v1beta...");
            return await callGeminiBeta(text);
        }

        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada respon.";
    };

    /**
     * Fungsi Cadangan menggunakan v1beta
     */
    const callGeminiBeta = async (text) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKeys.gemini}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: text }] }]
            })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, tidak ada respon.";
    };

    const handleGenerate = async (type) => {
        if (!prompt.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            let outputText = "";

            if (selectedEngine === 'gemini') {
                outputText = await callGeminiAPI(prompt);
            } else {
                // LOGIKA UNTUK GROQ
                const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKeys.groq}`
                    },
                    body: JSON.stringify({
                        model: "llama3-8b-8192",
                        messages: [{ role: "user", content: prompt }]
                    })
                });

                const data = await response.json();
                if (data.error) throw new Error(data.error.message);
                outputText = data.choices?.[0]?.message?.content;
            }

            setResult({ 
                type, 
                text: outputText,
                engine: selectedEngine 
            });

        } catch (err) {
            console.error("API Error:", err);
            setResult({ 
                type, 
                text: `Gagal memproses ${selectedEngine}: ${err.message}`,
                isError: true 
            });
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
            <span className="font-medium text-sm">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0c] text-white">
            <aside className="w-64 border-r border-gray-800 flex flex-col p-4 space-y-8 bg-[#0d0d0f]">
                <div className="flex items-center space-x-3 px-2">
                    <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
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
                
                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                    <div className="text-[10px] text-gray-500 uppercase font-bold mb-3 tracking-widest text-center">Engine Aktif</div>
                    <div className="flex p-1 bg-black rounded-xl gap-1">
                        <button onClick={() => setSelectedEngine('gemini')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${selectedEngine === 'gemini' ? 'bg-indigo-600' : 'text-gray-500'}`}>GEMINI</button>
                        <button onClick={() => setSelectedEngine('groq')} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${selectedEngine === 'groq' ? 'bg-orange-600' : 'text-gray-500'}`}>GROQ</button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-y-auto">
                <header className="h-16 border-b border-gray-800 flex items-center px-8 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center space-x-3">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Sistem Online | {selectedEngine}</span>
                    </div>
                </header>

                <div className="p-8 animate-fade-in">
                    {activeTab === 'dashboard' ? (
                        <div className="space-y-8 text-center py-20">
                            <h2 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Pusat Kreativitas AI</h2>
                            <p className="text-gray-400 max-w-lg mx-auto">Gunakan menu di samping untuk mulai menulis, membuat gambar, atau video.</p>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <h2 className="text-3xl font-bold capitalize">Generator {activeTab}</h2>
                            <div className="bg-[#151518] p-8 rounded-3xl border border-gray-800 space-y-6">
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Masukkan perintah atau ide Anda di sini..."
                                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 h-48 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-white text-lg"
                                />
                                <button 
                                    onClick={() => handleGenerate(activeTab)}
                                    disabled={loading || !prompt.trim()}
                                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all ${loading ? 'bg-gray-800' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'}`}
                                >
                                    {loading ? <LucideIcon name="loader-2" className="animate-spin" /> : <LucideIcon name="zap" />}
                                    <span>{loading ? 'AI sedang berpikir...' : 'Jalankan Perintah'}</span>
                                </button>
                            </div>

                            {result && (
                                <div className={`bg-[#151518] p-8 rounded-3xl border ${result.isError ? 'border-red-500/30' : 'border-indigo-500/30'} animate-fade-in`}>
                                    <div className="flex items-center space-x-2 text-indigo-400 font-bold text-[10px] mb-4 uppercase">
                                        <LucideIcon name={result.isError ? "alert-circle" : "check-circle"} size={14} />
                                        <span>Hasil {result.engine}</span>
                                    </div>
                                    <div className={`leading-relaxed text-lg whitespace-pre-wrap ${result.isError ? 'text-red-400' : 'text-gray-300'}`}>
                                        {result.text}
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
