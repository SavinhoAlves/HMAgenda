import React, { useState } from 'react';
import { useAgendamentos } from './hooks/useAgendamentos';
import AppointmentCard from './components/AppointmentCard';
import { Calendar, ChevronLeft, ChevronRight, Search, Plus, Printer, List, Settings } from 'lucide-react';

function App() {
  const { agendamentos, loading } = useAgendamentos();
  
  // Estrutura de dias da semana (Domingo a Sábado)
  const diasSemana = [
    { nome: 'Domingo', data: '8/Março' },
    { nome: 'Segunda', data: '9/Março' },
    { nome: 'Terça', data: '10/Março' },
    { nome: 'Quarta', data: '11/Março' },
    { nome: 'Quinta', data: '12/Março' },
    { nome: 'Sexta', data: '13/Março' },
    { nome: 'Sábado', data: '14/Março' },
  ];

  const horarios = Array.from({ length: 41 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 15;
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-900 animate-pulse uppercase">Sincronizando...</div>;

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans antialiased text-slate-700">
      
      {/* 1. HEADER PRINCIPAL (AZUL/BRANCO) */}
      <header className="bg-white border-b border-slate-200 px-6 py-2 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-[#1E293B] p-1.5 rounded-lg text-white"><Calendar size={18} /></div>
            <h1 className="text-lg font-black tracking-tighter text-[#1E293B]">HM <span className="font-light text-slate-400 italic">Agenda</span></h1>
          </div>
          <nav className="hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="text-blue-600 border-b-2 border-blue-600 py-3 mt-1">Agenda</span>
            <span className="hover:text-blue-600 py-3 mt-1 cursor-pointer transition-colors">Pacientes</span>
            <span className="hover:text-blue-600 py-3 mt-1 cursor-pointer transition-colors">Gestão</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase">savioalves169@gmail.com</span>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">S</div>
        </div>
      </header>

      {/* 2. TOOLBAR DE CONTROLE (DATAS E BUSCA) */}
      <section className="bg-white p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#2563EB]">Eveline</h2>
          <div className="relative w-64 md:w-80 ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input type="text" placeholder="Busque um paciente..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner" />
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex flex-col items-center p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all min-w-16">
            <Plus size={18} className="text-slate-400" /> <span className="text-[9px] font-bold uppercase mt-1">Novo</span>
          </button>
          <button className="flex flex-col items-center p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all min-w-16">
            <List size={18} className="text-slate-400" /> <span className="text-[9px] font-bold uppercase mt-1">Espera</span>
          </button>
          <button className="flex flex-col items-center p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all min-w-16">
            <Printer size={18} className="text-slate-400" /> <span className="text-[9px] font-bold uppercase mt-1">Imprimir</span>
          </button>
        </div>
      </section>

      {/* 3. NAVEGAÇÃO DE PERÍODO */}
      <div className="bg-[#F8FAFC] px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-md p-0.5">
            <button className="p-1.5 hover:bg-slate-50 rounded transition-all border-r border-slate-100"><ChevronLeft size={14}/></button>
            <button className="px-4 py-1 text-[10px] font-black uppercase hover:bg-slate-50 transition-all">Hoje</button>
            <button className="p-1.5 hover:bg-slate-50 rounded transition-all border-l border-slate-100"><ChevronRight size={14}/></button>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-md text-[11px] font-bold text-slate-500 flex items-center gap-2">
            <Calendar size={14} className="text-blue-500" /> 08/03 a 14/03
          </div>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-md p-0.5">
          <button className="px-5 py-1 text-[10px] font-bold uppercase text-slate-400 hover:text-blue-600 transition-all">Dia</button>
          <button className="px-5 py-1 text-[10px] font-black uppercase bg-blue-50 text-blue-600 rounded-sm">Semana</button>
        </div>
      </div>

      {/* 4. GRADE DE AGENDA SEMANAL */}
      <main className="flex-1 overflow-auto p-4 pt-0 custom-scrollbar">
        <div className="min-w-300 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          {/* Cabeçalho de Datas */}
          <div className="flex border-b border-slate-200 bg-white">
            <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50/50"></div>
            {diasSemana.map((dia, idx) => (
              <div key={idx} className={`flex-1 p-3 text-center border-r border-slate-200 last:border-0 ${idx === 0 ? 'bg-yellow-50/20' : ''}`}>
                <p className={`text-[11px] font-bold ${idx === 0 ? 'text-blue-600' : 'text-slate-600'} leading-none`}>{dia.nome}</p>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">{dia.data}</p>
              </div>
            ))}
          </div>

          {/* Grid de Horários */}
          <div className="relative">
            {horarios.map(hora => (
              <div key={hora} className="flex border-b border-slate-100 h-11 hover:bg-slate-50/30 transition-colors group">
                <div className="w-16 shrink-0 flex items-start justify-center text-[10px] font-bold text-slate-400 pt-2 border-r border-slate-200 bg-slate-50/10 font-mono">
                  {hora}
                </div>
                {diasSemana.map((dia, idx) => (
                  <div key={idx} className={`flex-1 border-r border-slate-100 last:border-0 relative hover:bg-blue-50/10 transition-colors ${idx === 0 ? 'bg-yellow-50/5' : ''}`}>
                    {agendamentos
                      .filter(a => a.horario.startsWith(hora)) 
                      .map(item => <AppointmentCard key={item.id} appointment={item} isCompact />)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;