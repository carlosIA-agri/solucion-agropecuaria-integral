import React, { useState, useEffect } from 'react';
import { History, Calendar, Search, Trash2, Bot, FileText, ChevronRight, User, Sparkles, Printer, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { DailyChatLog, ChatMessage } from '../types';
import { getDailyChatLogs, deleteChatLog, clearAllChatLogs } from '../data/specialistAndHistoryStore';

export const DailyChatHistory: React.FC = () => {
  const [logs, setLogs] = useState<DailyChatLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<DailyChatLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<'all' | 'agricola' | 'pecuario'>('all');

  const loadLogs = () => {
    const list = getDailyChatLogs();
    setLogs(list);
  };

  useEffect(() => {
    loadLogs();
    const handleUpdate = () => loadLogs();
    window.addEventListener('sai_chat_logs_updated', handleUpdate);
    return () => window.removeEventListener('sai_chat_logs_updated', handleUpdate);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSector = sectorFilter === 'all' || log.advisorType === sectorFilter;
    const matchesQuery =
      searchTerm === '' ||
      log.summarySnippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.specialistOnDuty.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.messages.some((m) => m.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSector && matchesQuery;
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteChatLog(id);
    if (selectedLog?.id === id) setSelectedLog(null);
    setConfirmDeleteId(null);
    loadLogs();
  };

  const handleClearAll = () => {
    deleteChatLog('ALL_LOGS'); // clear all
    clearAllChatLogs();
    setSelectedLog(null);
    loadLogs();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-xl border-b-4 border-emerald-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-800 rounded-2xl border border-emerald-600 shrink-0">
            <History className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">
              Registro Oficial Diario
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-1">
              Historial de Chats Diarios
            </h2>
            <p className="text-xs text-emerald-200">
              Almacenamiento y revisión de consultas técnicas atendidas por el Asesor Virtual y Especialistas de Turno
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-emerald-950/80 hover:bg-red-900 text-emerald-200 hover:text-white border border-emerald-700 hover:border-red-500 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              Borrar Todo el Historial
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en el historial de hoy..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>

        {/* Sector Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSectorFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
              sectorFilter === 'all'
                ? 'bg-emerald-800 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({logs.length})
          </button>
          <button
            onClick={() => setSectorFilter('agricola')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1 ${
              sectorFilter === 'agricola'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌾 Agrícola
          </button>
          <button
            onClick={() => setSectorFilter('pecuario')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1 ${
              sectorFilter === 'pecuario'
                ? 'bg-emerald-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🐄 Pecuario
          </button>
        </div>
      </div>

      {/* Content Layout */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
            <History className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg uppercase">
            No hay registros en el historial diario
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Las consultas técnicas que realice en los módulos de Asesoría Virtual Agrícola y Pecuaria se guardarán automáticamente aquí para su revisión continua.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List Column */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-1">
              <Calendar className="w-4 h-4 text-emerald-700" />
              Sesiones Registradas ({filteredLogs.length})
            </h3>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-600 shadow-lg ring-2 ring-emerald-500/50'
                        : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          log.advisorType === 'agricola'
                            ? isSelected
                              ? 'bg-emerald-700 text-emerald-100'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isSelected
                            ? 'bg-emerald-800 text-amber-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {log.advisorType === 'agricola' ? '🌾 Asesoría Agrícola' : '🐄 Asesoría Pecuaria'}
                      </span>
                      <span className={`text-[11px] font-mono ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                        {log.fechaIso} • {log.hora}
                      </span>
                    </div>

                    <h4 className={`font-bold text-sm line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {log.title}
                    </h4>

                    <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? 'text-emerald-100' : 'text-slate-600'}`}>
                      "{log.summarySnippet}"
                    </p>

                    <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${isSelected ? 'border-emerald-800 text-emerald-300' : 'border-slate-100 text-slate-500'}`}>
                      <span className="flex items-center gap-1 font-semibold truncate max-w-[180px]">
                        <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                        {log.specialistOnDuty?.nombreCompleto || 'Ing. Carlos Polanco'}
                      </span>

                      {confirmDeleteId === log.id ? (
                        <div className="flex items-center gap-1 bg-red-900/90 text-white px-2 py-1 rounded-lg text-[10px]" onClick={(e) => e.stopPropagation()}>
                          <span>¿Borrar?</span>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(log.id, e)}
                            className="bg-red-600 hover:bg-red-500 font-bold px-1.5 py-0.5 rounded text-white"
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                            className="bg-slate-700 hover:bg-slate-600 px-1.5 py-0.5 rounded text-slate-200"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(log.id);
                          }}
                          className={`p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors ${isSelected ? 'text-emerald-300 hover:bg-emerald-800' : 'text-slate-400'}`}
                          title="Eliminar este registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details / Transcript Column */}
          <div className="lg:col-span-2">
            {selectedLog ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[600px]">
                {/* Header */}
                <div className="bg-emerald-900 text-white p-5 border-b-4 border-emerald-600 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-800 text-emerald-200 border border-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {selectedLog.advisorType === 'agricola' ? 'Módulo Agrícola (Cultivos)' : 'Módulo Pecuario (Animales)'}
                      </span>
                      <span className="text-xs text-emerald-300 font-mono">
                        {selectedLog.fechaIso} • {selectedLog.hora}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg text-white">
                      {selectedLog.title}
                    </h3>
                    <p className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                      Especialista en Turno: <strong className="text-white">{selectedLog.specialistOnDuty.nombreCompleto}</strong> (Cédula: {selectedLog.specialistOnDuty.cedula})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrint}
                      className="p-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl transition-colors border border-emerald-600 text-xs font-bold flex items-center gap-1"
                      title="Imprimir transcripción"
                    >
                      <Printer className="w-4 h-4" />
                      <span className="hidden sm:inline">Imprimir</span>
                    </button>

                    <button
                      onClick={() => handleDelete(selectedLog.id)}
                      className="p-2 bg-red-900/80 hover:bg-red-800 text-red-200 hover:text-white rounded-xl transition-colors border border-red-700 text-xs font-bold flex items-center gap-1"
                      title="Eliminar esta conversación"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span className="hidden sm:inline">Eliminar Chat</span>
                    </button>

                    <button
                      onClick={() => setSelectedLog(null)}
                      className="p-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl transition-colors border border-emerald-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50">
                  {selectedLog.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 shadow border border-emerald-600">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-emerald-800 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-1 border-b border-black/10 pb-1 text-[10px]">
                          <span className="font-extrabold uppercase tracking-wider">
                            {msg.role === 'user' ? 'Productor / Cliente' : 'Asesoría Virtual SAI'}
                          </span>
                          <span className="opacity-70 font-mono">{msg.timestamp}</span>
                        </div>

                        {msg.mediaUrl && (
                          <div className="my-2 rounded-xl overflow-hidden border border-emerald-500/30 bg-black/10 p-1">
                            {msg.mediaType === 'image' ? (
                              <img src={msg.mediaUrl} alt="Adjunto" className="max-h-48 rounded-lg object-contain mx-auto" />
                            ) : (
                              <video src={msg.mediaUrl} controls className="max-h-48 rounded-lg w-full" />
                            )}
                          </div>
                        )}

                        <div className="whitespace-pre-wrap font-sans text-xs">
                          {msg.content}
                        </div>
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center h-[600px] flex flex-col items-center justify-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300" />
                <h4 className="font-bold text-slate-700 text-base uppercase">
                  Seleccione una conversación para revisar
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Haga clic en cualquiera de las sesiones del panel izquierdo para desplegar la transcripción técnica completa del diálogo con el especialista.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
