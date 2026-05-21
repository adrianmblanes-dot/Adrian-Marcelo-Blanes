import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dice5, History, Info, ChevronRight, Wand2, Download, Dices, Eye, Sparkle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PLANETS, SIGNS, HOUSES } from './constants';
import { interpretDice } from './services/geminiService';
import PlanetOrbits from './components/PlanetOrbits';
import StarsBackground from './components/StarsBackground';
import FloatingDecoration from './components/FloatingDecoration';
import RollingDice from './components/RollingDice';

export default function App() {
  const [selectedPlanet, setSelectedPlanet] = useState(PLANETS[0]);
  const [selectedSign, setSelectedSign] = useState(SIGNS[0]);
  const [selectedHouse, setSelectedHouse] = useState(HOUSES[0]);
  const [question, setQuestion] = useState('');
  const [userName, setUserName] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading]);

  const handleConsult = async (overridePlanet?: typeof PLANETS[0], overrideSign?: typeof SIGNS[0], overrideHouse?: typeof HOUSES[0]) => {
    setLoading(true);
    setInterpretation(null);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      const p = overridePlanet || selectedPlanet;
      const s = overrideSign || selectedSign;
      const h = overrideHouse || selectedHouse;

      const result = await interpretDice(
        `${p.name} (${p.symbol})`,
        `${s.name} (${s.symbol})`,
        `${h.name}`,
        question.trim() || undefined,
        userName.trim() || undefined
      );

      // Force a minimum loading time for the dice animation
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 2000; 
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }

      setInterpretation(result);
    } catch (err: any) {
      // Rompemos el filtro: ahora la pantalla te dirá el error real del servicio
      setError(err?.message || 'Las estrellas están nubladas hoy. Intenta de nuevo en un momento.');
    } finally {
      setLoading(false);
    }
  };

  const rollDiceAndConsult = () => {
    const p = PLANETS[Math.floor(Math.random() * PLANETS.length)];
    const s = SIGNS[Math.floor(Math.random() * SIGNS.length)];
    const h = HOUSES[Math.floor(Math.random() * HOUSES.length)];
    setSelectedPlanet(p);
    setSelectedSign(s);
    setSelectedHouse(h);
    handleConsult(p, s, h);
  };

  const generatePDF = () => {
    if (!interpretation) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    // Header Color
    doc.setFillColor(12, 12, 14); // Mystic Black background
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Title
    doc.setTextColor(212, 175, 55); // Mystic Gold
    doc.setFontSize(26);
    doc.setFont('times', 'bold');
    doc.text('DADOS ASTROLÓGICOS DE ADRIANO', pageWidth / 2, 22, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('times', 'italic');
    doc.text('Respuesta de la consulta astral', pageWidth / 2, 32, { align: 'center' });

    y = 55;

    // Date & Time
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    let dateLine = `Fecha: ${new Date().toLocaleDateString()}  Hora: ${new Date().toLocaleTimeString()}`;
    if (userName) {
      dateLine += `  Consultante: ${userName}`;
    }
    doc.text(dateLine, margin, y);
    y += 15;

    // The Question
    if (question) {
      doc.setTextColor(10, 10, 10);
      doc.setFontSize(12);
      doc.setFont('times', 'italic');
      const splitQuestion = doc.splitTextToSize(`Tu pregunta: "${question}"`, contentWidth);
      doc.text(splitQuestion, margin, y);
      y += (splitQuestion.length * 7) + 15;
    }

    // Results Box
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentWidth, 25);
    
    doc.setTextColor(12, 12, 14);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DADOS OBTENIDOS:', margin + 5, y + 8);
    
    doc.setFontSize(14);
    doc.text(`${selectedPlanet.symbol} ${selectedPlanet.name}`, margin + 5, y + 18);
    doc.text(`${selectedSign.symbol} ${selectedSign.name}`, margin + (contentWidth / 3) + 5, y + 18);
    doc.text(`CASA ${selectedHouse.id}`, margin + (contentWidth * 2 / 3) + 5, y + 18);
    
    y += 40;

    // Interpretation Header
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(14);
    doc.setFont('times', 'bold');
    doc.text('Interpretación del Oráculo:', margin, y);
    y += 10;

    // Interpretation
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const splitInterpretation = doc.splitTextToSize(interpretation, contentWidth);
    
    // Check for page overflow
    if (y + (splitInterpretation.length * 6) > doc.internal.pageSize.getHeight() - 50) {
        // Simple page management
        let linesOnFirstPage = Math.floor((doc.internal.pageSize.getHeight() - 50 - y) / 6);
        doc.text(splitInterpretation.slice(0, linesOnFirstPage), margin, y);
        doc.addPage();
        y = 20;
        doc.text(splitInterpretation.slice(linesOnFirstPage), margin, y);
        y += (splitInterpretation.slice(linesOnFirstPage).length * 6) + 20;
    } else {
        doc.text(splitInterpretation, margin, y);
        y += (splitInterpretation.length * 6) + 20;
    }

    // Footer Message
    const footerY = doc.internal.pageSize.getHeight() - 35;
    doc.setDrawColor(212, 175, 55);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    const footerText = "Retoma la pregunta si es relevante en 7 dias aproximadamente y complemente esta respuesta con el Tarot de Adriano comunicate sin compromiso al whatsapp +542617116896 y descubre lo que el tarot tiene que revelarte";
    const splitFooter = doc.splitTextToSize(footerText, contentWidth);
    doc.text(splitFooter, margin, footerY);

    doc.save(`Lectura_Adriano_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-mystic-black text-white selection:bg-mystic-gold selection:text-mystic-black p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      <StarsBackground />
      <FloatingDecoration />
      
      {/* Header */}
      <header className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between mb-12 mt-4 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <PlanetOrbits />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
           className="text-center lg:text-right flex-grow"
        >
          <h1 className="text-4xl md:text-6xl font-serif mb-4 text-mystic-gold tracking-tight drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            Los Dados Astrológicos de Adriano
          </h1>
          <p className="text-zinc-400 font-light text-lg italic uppercase tracking-[0.2em] opacity-80">
            Santuario del Destino &bull; Lectura Predictiva
          </p>
        </motion.div>
      </header>

      <main className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <section className="lg:col-span-5 space-y-8">
          <div className="bg-mystic-indigo/40 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h2 className="text-xl font-serif text-mystic-gold mb-8 flex items-center gap-3">
              <Wand2 className="w-5 h-5" /> Tu Consulta al Oráculo
            </h2>

            <div className="space-y-10">
              {/* Consultant Name Input */}
              <div className="relative group">
                <label className="text-[10px] uppercase tracking-[0.4em] text-mystic-gold/70 mb-3 block font-bold">Consultante</label>
                <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Tu nombre..."
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-mystic-gold/60 focus:bg-white/[0.08] transition-all placeholder:text-zinc-700 shadow-inner"
                />
              </div>

              {/* Question Input */}
              <div ref={questionRef} className="relative group scroll-mt-8">
                <label className="text-[10px] uppercase tracking-[0.4em] text-mystic-gold/70 mb-3 block font-bold">Interrogante</label>
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="¿Qué te inquieta hoy? Expón tu duda..."
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-mystic-gold/60 focus:bg-white/[0.08] transition-all resize-none placeholder:text-zinc-700 min-h-[100px] shadow-inner"
                />

                <div className="mt-10 flex flex-col sm:flex-row gap-5">
                  <button 
                    onClick={rollDiceAndConsult}
                    disabled={loading}
                    className="flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-3xl border border-violet-500/40 text-zinc-400 hover:text-violet-200 hover:bg-violet-950/30 transition-all text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-50 group hover:border-violet-400/60 shadow-[0_0_40px_rgba(139,92,246,0.2)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] relative overflow-hidden backdrop-blur-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-6 h-6 mb-1 text-violet-400 group-hover:text-violet-300 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" /> 
                    <span className="relative z-10">Avanza con tu consulta</span>
                  </button>
                  <button 
                    onClick={() => handleConsult()}
                    disabled={loading}
                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-3xl bg-mystic-gold text-mystic-black font-black transition-all hover:scale-[1.02] active:scale-[0.98] text-[11px] uppercase tracking-[0.25em] shadow-[0_15px_40px_-10px_rgba(212,175,55,0.4)] border-2 border-white/20 hover:border-white/50 group relative overflow-hidden ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Eye className="w-6 h-6 mb-1 group-hover:scale-125 transition-transform duration-500 text-mystic-black/80" /> 
                    <span className="relative z-10 px-4 text-center">Revelar la astrología seleccionada Manual</span>
                  </button>
                </div>

                <div className="mt-6 flex justify-center">
                  <button 
                    onClick={() => {
                      setQuestion('');
                      setUserName('');
                      setInterpretation(null);
                      setSelectedPlanet(PLANETS[0]);
                      setSelectedSign(SIGNS[0]);
                      setSelectedHouse(HOUSES[0]);
                    }}
                    className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 hover:text-mystic-gold transition-colors flex items-center gap-2 py-2 px-4 rounded-full border border-white/5 hover:border-mystic-gold/20"
                  >
                    <History className="w-3 h-3" /> Reiniciar ritual
                  </button>
                </div>
              </div>

              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Planet Selector */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.4em] text-mystic-gold/70 mb-5 block font-bold">Cuerpo Celeste</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                  {PLANETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlanet(p)}
                      title={p.name}
                      style={{ color: selectedPlanet.id === p.id ? p.color : undefined }}
                      className={`group relative aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all duration-500 shadow-sm ${
                        selectedPlanet.id === p.id 
                        ? 'border-current bg-white/[0.08] shadow-[0_0_25px_-5px_currentColor] scale-110 z-10' 
                        : 'border-white/5 bg-white/[0.02] hover:border-white/20 text-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      <span 
                        className={`text-2xl transition-all duration-500 ${selectedPlanet.id === p.id ? 'animate-mystic-glow' : 'group-hover:scale-120'}`}
                      >
                        {p.symbol}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 backdrop-blur-sm shadow-xl">
                   <p className="text-sm text-zinc-400 leading-relaxed italic">
                     <span className="text-mystic-gold font-serif text-xl not-italic block mb-2 tracking-wide uppercase">{selectedPlanet.name}</span> 
                     {selectedPlanet.description}
                   </p>
                </div>
              </div>

              {/* Sign Selector */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.4em] text-mystic-gold/70 mb-5 block font-bold">Frecuencia Zodiacal</label>
                <div className="grid grid-cols-6 gap-3">
                  {SIGNS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSign(s)}
                      title={s.name}
                      className={`aspect-square flex items-center justify-center rounded-xl border transition-all duration-500 ${
                        selectedSign.id === s.id 
                        ? 'border-mystic-gold bg-mystic-gold/15 text-mystic-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                        : 'border-white/5 bg-white/[0.01] hover:border-white/20 text-zinc-700 hover:text-zinc-500'
                      }`}
                    >
                      <span className={`text-xl ${selectedSign.id === s.id ? 'animate-pulse' : ''}`}>{s.symbol}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 backdrop-blur-sm shadow-xl">
                  <p className="text-sm text-zinc-400 leading-relaxed italic">
                    <span className="text-mystic-gold font-serif text-xl not-italic block mb-2 tracking-wide uppercase">{selectedSign.name} ({selectedSign.element})</span> 
                    {selectedSign.description}
                  </p>
                </div>
              </div>

              {/* House Selector */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.4em] text-mystic-gold/70 mb-5 block font-bold">Escenario de Manifestación</label>
                <div className="grid grid-cols-6 gap-3">
                  {HOUSES.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHouse(h)}
                      title={h.name}
                      className={`h-12 flex flex-col items-center justify-center rounded-xl border transition-all duration-500 relative overflow-hidden ${
                        selectedHouse.id === h.id 
                        ? 'border-mystic-gold bg-mystic-gold/25 text-mystic-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                        : 'border-white/5 bg-white/[0.01] hover:border-white/20 text-zinc-800 hover:text-zinc-600'
                      }`}
                    >
                      <span className="text-xs font-mono font-black">{h.id}</span>
                      <div className={`absolute bottom-0 w-full h-0.5 bg-mystic-gold transition-transform duration-700 ${selectedHouse.id === h.id ? 'scale-x-100' : 'scale-x-0'}`} />
                    </button>
                  ))}
                </div>
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 backdrop-blur-sm shadow-xl">
                  <p className="text-sm text-zinc-400 leading-relaxed italic">
                    <span className="text-mystic-gold font-serif text-xl not-italic block mb-2 tracking-wide uppercase">Casa {selectedHouse.id}</span> 
                    {selectedHouse.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Output */}
        <section ref={resultsRef} className="lg:col-span-7 h-full text-scroll-mt-8">
          <div className="min-h-[600px] h-full bg-mystic-indigo/20 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-xl shadow-inner group transition-all duration-700 hover:bg-mystic-indigo/30">
            {/* Visual Dice Rep */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <span className="text-[12rem] font-serif leading-none italic">{selectedPlanet.symbol}</span>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-8 py-20 relative z-10"
                >
                  <RollingDice 
                    planet={selectedPlanet}
                    sign={selectedSign}
                    house={selectedHouse}
                    isFinished={false}
                  />
                  <div className="space-y-3">
                    <h3 className="text-mystic-gold font-serif text-2xl italic animate-pulse">Lanzando los Dados...</h3>
                    <p className="text-zinc-500 text-xs tracking-[0.3em] uppercase">Consultando la bóveda celeste</p>
                  </div>
                </motion.div>
              ) : interpretation ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="relative z-10 h-full flex flex-col pt-4"
                >
                  <RollingDice 
                    planet={selectedPlanet}
                    sign={selectedSign}
                    house={selectedHouse}
                    isFinished={true}
                  />

                  <div className="flex items-center gap-6 mb-12 justify-center">
                    <div className="flex items-center gap-4 text-5xl md:text-6xl font-serif">
                      <span 
                        style={{ color: selectedPlanet.color }}
                        className="animate-mystic-glow filter drop-shadow-[0_0_15px_currentColor]"
                      >
                        {selectedPlanet.symbol}
                      </span>
                      <ChevronRight className="w-6 h-6 text-zinc-900" />
                      <span className="text-mystic-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                        {selectedSign.symbol}
                      </span>
                      <ChevronRight className="w-6 h-6 text-zinc-900" />
                      <span className="text-2xl font-mono border border-mystic-gold/40 px-4 py-2 rounded-xl bg-mystic-gold/10 text-mystic-gold shadow-sm">
                        {selectedHouse.id}
                      </span>
                    </div>
                  </div>

                  {question && (
                    <div className="mb-10 p-5 border-l-4 border-mystic-gold/60 bg-mystic-gold/5 rounded-r-2xl backdrop-blur-sm">
                      <p className="text-[11px] uppercase tracking-[0.4em] text-mystic-gold mb-2 font-bold opacity-80">La Consulta</p>
                      <p className="text-lg italic text-zinc-300 font-serif leading-relaxed">"{question}"</p>
                    </div>
                  )}

                  <div className="space-y-8 flex-grow">
                    <div className="whitespace-pre-wrap font-serif text-2xl leading-[1.6] text-zinc-200 tracking-wide first-letter:text-5xl first-letter:text-mystic-gold first-letter:float-left first-letter:mr-3 first-letter:font-bold">
                      {interpretation}
                    </div>
                  </div>

                  <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <button 
                        onClick={() => {
                          setInterpretation(null);
                          setQuestion('');
                          setUserName('');
                          setSelectedPlanet(PLANETS[0]);
                          setSelectedSign(SIGNS[0]);
                          setSelectedHouse(HOUSES[0]);
                          questionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-xs uppercase tracking-[0.3em] text-mystic-gold hover:text-white transition-all duration-500 flex items-center gap-3 font-black px-8 py-4 rounded-full border-2 border-mystic-gold/40 hover:border-mystic-gold bg-mystic-gold/10 hover:bg-mystic-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 group/reset"
                      >
                        <History className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-700" /> Reiniciar Consulta
                      </button>

                      <button 
                        onClick={generatePDF}
                        className="text-xs uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all duration-300 flex items-center gap-3 font-bold px-6 py-4 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 group/pdf shadow-lg"
                      >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> Descargar Informe PDF
                      </button>
                    </div>

                    <div className="hidden lg:block text-[10px] text-zinc-700 uppercase tracking-widest italic font-light max-w-[200px] text-right">
                      Sabiduría Ancestral &bull; {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-8 py-20"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-mystic-gold/20 blur-3xl animate-pulse rounded-full" />
                    <div className="relative w-24 h-24 rounded-full border-2 border-zinc-800/50 flex items-center justify-center text-zinc-800">
                      <Info className="w-10 h-10" />
                    </div>
                  </div>
                  <div className="max-w-sm space-y-4">
                    <h3 className="text-zinc-600 font-serif text-3xl italic tracking-wide">Inicia el Ritual</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed tracking-wider">
                      Formula tu pregunta, elige los dados o deja que el azar guíe tu energía hacia la verdad oculta.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-red-950/40 border border-red-500/30 text-red-400 text-[11px] rounded-2xl text-center backdrop-blur-md animate-bounce">
                {error}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-12 text-center text-zinc-800 text-[11px] uppercase tracking-[0.5em] font-light border-t border-white/5 w-full max-w-4xl">
        &copy; {new Date().getFullYear()} ADRIANO &bull; EL ORÁCULO DE LAS ESTRELLAS
      </footer>
    </div>
  );
}
