import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  Camera,
  Paperclip,
  X,
  Film,
  Mic,
  CheckCircle2,
  Droplets,
  Sprout,
  ShieldAlert,
  Award,
} from 'lucide-react';
import { ChatMessage, AgroProduct } from '../types';
import { saveOrUpdateChatLog, getActiveSpecialist } from '../data/specialistAndHistoryStore';

interface ChatAdvisorProps {
  initialMode?: 'agricola' | 'pecuario';
}

const PRESET_QUERIES_AGRICOLA = [
  {
    title: 'Sigatoka Negra en Banano - El Oro',
    text: 'Buenas tardes. Poseo 5 hectáreas de banano en Machala (El Oro) con manchas amarillas y necróticas foliares (Sigatoka negra). Requiero recomendación de fungicida sistémico con dosis, forma de aplicación, frecuencia y días de carencia.',
  },
  {
    title: 'Gusano Cogollero en Maíz - Los Ríos',
    text: 'Hola. En Ventanas (Los Ríos) el gusano cogollero está atacando 10 hectáreas de maíz en etapa V4. ¿Qué insecticida puedo aplicar, cuál es la dosis por bomba de 20 Litros y si debo repetir?',
  },
  {
    title: 'Gota / Tizón en Papa - Carchi',
    text: 'Buenos días. En San Gabriel (Carchi) el cultivo de papa tiene hojas quemadas por la gota o tizón tardío por exceso de lluvias. ¿Qué fungicida preventivo-curativo aplico y cada cuántos días repito?',
  },
];

const PRESET_QUERIES_PECUARIO = [
  {
    title: 'Bovinos con Mastitis - Pichincha',
    text: 'Estimado asesor, tengo vacas de leche Holstein en Machachi (Pichincha) con inflamación de ubre, fiebre y leche con grumos. ¿Qué antibiótico inyectable me recomienda, dosis por peso y cuál es el período de resguardo en leche y carne?',
  },
  {
    title: 'Desparasitante Ganado - Manabí',
    text: 'Saludos. Necesito desparasitar 40 cabezas de ganado bovino de carne en Chone (Manabí) y aplicarles vitaminas para recuperar peso. ¿Qué productos de Ecuador me aconseja, cuál es la dosis exacta por kg y la forma de aplicación?',
  },
  {
    title: 'Manejo Sanitario Porcino - Santo Domingo',
    text: 'Estimado. En Santo Domingo tengo 30 cerdos de engorde con problemas respiratorios leves. ¿Qué protocolo sanitario me sugiere?',
  },
];

export const ChatAdvisor: React.FC<ChatAdvisorProps> = ({ initialMode = 'agricola' }) => {
  const [advisorMode, setAdvisorMode] = useState<'agricola' | 'pecuario'>(initialMode);
  const [sessionId] = useState<string>(`session-${Date.now()}`);

  const activeSpecialist = getActiveSpecialist();

  const getWelcomeMessage = (mode: 'agricola' | 'pecuario'): ChatMessage => {
    if (mode === 'agricola') {
      return {
        id: `welcome-agricola-${Date.now()}`,
        role: 'assistant',
        content: `Estimado(a) productor(a) agrícola, reciba un cordial saludo de Solución Agropecuaria Integral.

Soy su Asesor Técnico Agrícola (Especialista con 10 años de experiencia en Manejo Integrado de Plagas, Enfermedades y Nutrición Vegetal).

PROTOCOLO OBLIGATORIO DE SALUD Y EFICACIA EN CULTIVOS:
Ante cualquier problema de plagas o enfermedades, recuerde que el PASO 1 OBLIGATORIO antes de verter fungicidas, insecticidas o foliares es medir y corregir el pH del agua con un regulador de pH (pH óptimo 5.0 - 6.0). Un agua alcalina o dura destruye hasta el 80% del ingrediente activo antes de fumigar.

Para iniciar su asesoría técnica, por favor indíqueme:
1. ¿Qué cultivo necesita atender? (ej. Banano, Cacao, Maíz, Papa, Arroz, Flores, Frutales)
2. ¿En qué Provincia / Cantón se encuentra su parcela?
3. ¿Qué síntomas observa en hojas, tallos o frutos?`,
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      };
    } else {
      return {
        id: `welcome-pecuario-${Date.now()}`,
        role: 'assistant',
        content: `Estimado(a) productor(a) pecuario, un educado saludo de Solución Agropecuaria Integral.

Soy su Asesor Técnico Pecuario (Especialista con 10 años de experiencia en Manejo Nutricional, Sanitario y Productivo de animales de producción).

Le asisto en la evaluación técnica de bovinos (leche/carne), porcinos, aves, ovinos y acuacultura en Ecuador.

Por favor compártame los detalles de su caso:
1. ¿Especie animal y etapa productiva? (ej. Vacas de leche, Terneros, Porcinos engorde, Avícola)
2. ¿Ubicación geográfica en Ecuador?
3. ¿Síntomas observados, número de animales afectados y peso aproximado?`,
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      };
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    getWelcomeMessage(initialMode === 'pecuario' ? 'pecuario' : 'agricola'),
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: 'image' | 'video';
    name: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanText = (text: string) => {
    if (!text) return '';
    return text.replace(/[*#]/g, '');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Auto sync to daily chat history store
    if (messages.length > 0) {
      saveOrUpdateChatLog({
        id: sessionId,
        advisorType: advisorMode,
        title: advisorMode === 'agricola' ? 'Asesoría Técnica Virtual Agrícola' : 'Asesoría Técnica Virtual Pecuaria',
        messages,
      });
    }
  }, [messages, loading, advisorMode]);

  const handleSwitchMode = (newMode: 'agricola' | 'pecuario') => {
    if (newMode === advisorMode) return;
    setAdvisorMode(newMode);
    setMessages([getWelcomeMessage(newMode)]);
    setSelectedMedia(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('El archivo supera el límite de 25MB. Por favor seleccione una foto o video más corto.');
      return;
    }

    const isVideo = file.type.startsWith('video');
    const isAudio = file.type.startsWith('audio/');
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) return;

      if (!isVideo && !isAudio && file.type.startsWith('image/')) {
        // Compress photo using canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = 1200;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            setSelectedMedia({
              url: resizedDataUrl,
              type: 'image',
              name: file.name,
            });
          } else {
            setSelectedMedia({ url: rawResult, type: 'image', name: file.name });
          }
        };
        img.onerror = () => {
          setSelectedMedia({ url: rawResult, type: 'image', name: file.name });
        };
        img.src = rawResult;
      } else {
        setSelectedMedia({
          url: rawResult,
          type: isAudio ? 'audio' : isVideo ? 'video' : 'image',
          name: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if ((!text && !selectedMedia) || loading) return;

    const mediaToAttach = selectedMedia;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text || (mediaToAttach ? 'Adjunto foto/video para evaluación técnica.' : ''),
      mediaUrl: mediaToAttach?.url,
      mediaType: mediaToAttach?.type,
      mediaName: mediaToAttach?.name,
      timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setSelectedMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);

    try {
      // Send payload to backend - only pass full mediaUrl for the active last user message
      const payloadMessages = newMessages.map((m, idx) => {
        const isLatest = idx === newMessages.length - 1;
        return {
          role: m.role,
          content: m.content,
          mediaUrl: isLatest ? m.mediaUrl : (m.mediaUrl ? '[media]' : undefined),
        };
      });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          userContext: {
            sector: advisorMode,
            specialistDuty: activeSpecialist.nombreCompleto,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Error de conexión con el servidor.');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text,
        timestamp: data.timestamp || new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat send error:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Estimado(a) productor(a), ocurrió una breve interrupción en el servicio. Por favor vuelva a enviar su mensaje.`,
        timestamp: new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const presetQueries = advisorMode === 'agricola' ? PRESET_QUERIES_AGRICOLA : PRESET_QUERIES_PECUARIO;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* 2 Main Advisor Selection Buttons */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border border-slate-200">
        <div className="text-center mb-4">
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Selección de Módulo de Asesoría Virtual Especializada
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight mt-1">
            Elija el canal técnico para su consulta
          </h2>
          <p className="text-xs text-slate-500">
            Respaldo técnico directo de profesionales con 10 años de experiencia en territorio ecuatoriano
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Button 1: Asesoría Técnica Virtual Agrícola */}
          <button
            type="button"
            onClick={() => handleSwitchMode('agricola')}
            className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex items-start gap-4 ${
              advisorMode === 'agricola'
                ? 'bg-emerald-900 text-white border-emerald-500 shadow-xl ring-4 ring-emerald-500/30'
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                advisorMode === 'agricola'
                  ? 'bg-emerald-800 text-emerald-300 border-emerald-600'
                  : 'bg-white text-emerald-700 border-slate-300'
              }`}
            >
              <Sprout className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    advisorMode === 'agricola' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-900'
                  }`}
                >
                  🌾 Enfoque Cultivos
                </span>
                <span className="text-[10px] font-bold text-amber-300">10 Años Exp.</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg uppercase tracking-tight">
                Asesoría Virtual Agrícola
              </h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  advisorMode === 'agricola' ? 'text-emerald-200' : 'text-slate-600'
                }`}
              >
                Manejo Integrado de Plagas (MIP), enfermedades fúngicas/bacterianas, nutrición foliar y corrector de pH del agua.
              </p>
            </div>
          </button>

          {/* Button 2: Asesoría Técnica Virtual Pecuaria */}
          <button
            type="button"
            onClick={() => handleSwitchMode('pecuario')}
            className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex items-start gap-4 ${
              advisorMode === 'pecuario'
                ? 'bg-emerald-950 text-white border-emerald-500 shadow-xl ring-4 ring-emerald-500/30'
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                advisorMode === 'pecuario'
                  ? 'bg-emerald-900 text-amber-300 border-emerald-700'
                  : 'bg-white text-amber-800 border-slate-300'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    advisorMode === 'pecuario' ? 'bg-amber-500 text-slate-950' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  🐄 Enfoque Animales
                </span>
                <span className="text-[10px] font-bold text-amber-300">10 Años Exp.</span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg uppercase tracking-tight">
                Asesoría Virtual Pecuaria
              </h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  advisorMode === 'pecuario' ? 'text-emerald-200' : 'text-slate-600'
                }`}
              >
                Manejo nutricional, sanitario, protocolo sanitario veterinario, antiparasitarios y tiempos de resguardo.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Mandatory Agricultural pH Banner if mode === 'agricola' */}
      {advisorMode === 'agricola' && (
        <div className="bg-amber-500 text-slate-950 border-2 border-amber-600 rounded-2xl p-4 shadow-md flex items-start gap-3">
          <Droplets className="w-6 h-6 text-slate-950 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold leading-relaxed">
            <strong className="uppercase font-black block text-sm tracking-tight text-slate-950">
              Protocolo Técnico Obligatorio Módulo Agrícola (Paso 1 Indispensable)
            </strong>
            Ante cualquier aplicación para control de plagas o enfermedades en cultivos, el{' '}
            <u className="font-black">primer paso obligatorio</u> antes de la mezcla es la{' '}
            <span className="font-extrabold">medición y corrección del pH del agua</span> mediante un regulador/corrector de pH. El agua con pH alcalino o alto degrada los ingredientes activos en el tanque restando hasta un 80% de su efectividad.
          </div>
        </div>
      )}

      {/* Preset Queries Grid */}
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Ejemplos de consultas frecuentes ({advisorMode === 'agricola' ? 'Agrícola' : 'Pecuaria'}):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presetQueries.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(preset.text)}
              disabled={loading}
              className="text-left bg-white hover:bg-emerald-50/90 border border-slate-200 hover:border-emerald-500 p-3.5 rounded-2xl text-xs transition-all shadow-sm hover:shadow group"
            >
              <span className="font-bold text-slate-800 group-hover:text-emerald-900 block mb-1">
                {preset.title}
              </span>
              <p className="text-slate-500 line-clamp-2 text-[11px]">"{preset.text}"</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Frame */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[650px]">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center shrink-0 border border-emerald-600 shadow mt-0.5 font-black text-xs">
                  <Bot className="w-5 h-5 text-emerald-300" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] p-4 sm:p-5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-800 text-white rounded-2xl rounded-tr-none shadow-md'
                    : 'bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-200'
                }`}
              >
                <div
                  className={`flex items-center justify-between gap-4 mb-2 pb-1 text-[11px] font-extrabold uppercase tracking-wider ${
                    msg.role === 'user'
                      ? 'border-b border-emerald-600 text-emerald-200'
                      : 'border-b border-slate-100 text-emerald-900'
                  }`}
                >
                  <span>
                    {msg.role === 'user'
                      ? 'Productor / Cliente'
                      : advisorMode === 'agricola'
                      ? 'Asesor Técnico Agrícola (10 Años Exp.)'
                      : 'Asesor Técnico Pecuario (10 Años Exp.)'}
                  </span>
                  <span className="font-mono text-[10px] opacity-75">{msg.timestamp}</span>
                </div>

                {/* Media file if attached */}
                {msg.mediaUrl && (
                  <div className="my-2.5 rounded-xl overflow-hidden border border-emerald-500/30 bg-black/10 p-2">
                    {msg.mediaType === 'image' ? (
                      <img
                        src={msg.mediaUrl}
                        alt="Adjunto"
                        className="max-h-72 w-full object-contain rounded-lg bg-black/20"
                      />
                    ) : msg.mediaType === 'audio' ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                          <Mic className="w-3.5 h-3.5" /> Audio de voz adjunto
                        </span>
                        <audio src={msg.mediaUrl} controls className="w-full rounded-lg" />
                      </div>
                    ) : (
                      <video src={msg.mediaUrl} controls className="max-h-72 w-full rounded-lg bg-black" />
                    )}
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm space-y-2">
                  {cleanText(msg.content)}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center shrink-0 border border-slate-600 shadow mt-0.5 font-bold text-xs">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-slate-700 text-xs font-bold p-4 bg-white rounded-2xl border border-slate-200 max-w-xs shadow-sm">
              <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
              <span>Procesando consulta con Especialista en Turno...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          {selectedMedia && (
            <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 overflow-hidden">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.url}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-emerald-400 shrink-0"
                  />
                ) : selectedMedia.type === 'audio' ? (
                  <div className="w-12 h-12 bg-emerald-900 text-amber-300 rounded-lg flex items-center justify-center shrink-0 border border-emerald-600">
                    <Mic className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-emerald-900 text-amber-300 rounded-lg flex items-center justify-center shrink-0">
                    <Film className="w-6 h-6" />
                  </div>
                )}
                <div className="truncate">
                  <p className="font-extrabold text-emerald-950 truncate text-xs">{selectedMedia.name}</p>
                  <p className="text-[10px] text-emerald-700 font-bold">
                    {selectedMedia.type === 'audio'
                      ? 'Nota de voz cargada lista para análisis'
                      : 'Foto/Video listo para evaluación visual'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMedia(null)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,video/*,audio/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="p-3 bg-slate-100 hover:bg-emerald-100/80 text-slate-700 hover:text-emerald-800 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 border border-slate-300 font-bold text-xs"
              title="Adjuntar foto, video o audio de voz"
            >
              <Camera className="w-4 h-4 text-emerald-700" />
              <Mic className="w-3.5 h-3.5 text-amber-700" />
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                advisorMode === 'agricola'
                  ? 'Describa el síntoma en su cultivo o adjunte una foto/video...'
                  : 'Describa la afección de sus animales o adjunte una foto/video...'
              }
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-slate-800 placeholder-slate-400 font-medium"
            />

            <button
              type="submit"
              disabled={loading || (!inputMessage.trim() && !selectedMedia)}
              className="bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
