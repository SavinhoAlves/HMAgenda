import React, { useState } from 'react';
import { useAgendamentos } from './hooks/useAgendamentos';
import AppointmentCard from './components/AppointmentCard';
import { supabase } from './services/supabaseClient';
import { Calendar, ChevronLeft, ChevronRight, Search, Plus, Printer, List, X } from 'lucide-react';

// COMPONENTE DE MODAL (Estilo iClinic)
const ModalAgendamento = ({ isOpen, onClose, slot, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header do Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-black text-[#1E293B] text-[11px] uppercase tracking-widest flex items-center gap-2">
            <Plus size={14} className="text-blue-600" /> Adicionar agendamento
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          onSave(Object.fromEntries(formData));
        }} className="p-6 space-y-5">
          
          <div className="flex items-center gap-6 p-3 bg-blue-50/50 rounded-md border border-blue-100">
            <div className="text-[10px] font-black uppercase text-blue-600">
              Data: <span className="text-slate-900 ml-1">{slot?.dia.data}</span>
            </div>
            <div className="text-[10px] font-black uppercase text-blue-600">
              Horário: <span className="text-slate-900 ml-1">{slot?.hora}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Paciente</label>
            <input 
              name="paciente_nome" 
              required 
              placeholder="Digite o nome completo..."
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-inner" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Telefone Celular</label>
              <input name="telefone" placeholder="(00) 00000-0000" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Convênio / Procedimento</label>
              <select name="tipo" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer">
                <option value="Particular">Particular</option>
                <option value="Retorno">Retorno</option>
                <option value="Convênio">Convênio</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-3.5 bg-blue-600 text-white font-black uppercase text-[11px] tracking-widest rounded-md hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all">
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function App() {
  const { agendamentos, loading } = useAgendamentos();
  const [busca, setBusca] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const diasSemana = [
    { nome: 'Domingo', data: '8/Março', dataISO: '2026-03-08' },
    { nome: 'Segunda', data: '9/Março', dataISO: '2026-03-09' },
    { nome: 'Terça', data: '10/Março', dataISO: '2026-03-10' },
    { nome: 'Quarta', data: '11/Março', dataISO: '2026-03-11' },
    { nome: 'Quinta', data: '12/Março', dataISO: '2026-03-12' },
    { nome: 'Sexta', data: '13/Março', dataISO: '2026-03-13' },
    { nome: 'Sábado', data: '14/Março', dataISO: '2026-03-14' },
  ];

  const horarios = Array.from({ length: 41 }, (_, i) => {
    const totalMinutes = 8 * 60 + i * 15;
    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const minutes = (totalMinutes % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const onConfirmSave = async (formData) => {
    const novoAgendamento = {
      ...formData,
      data: selectedSlot.dia.dataISO,
      horario: selectedSlot.hora,
    };

    const { error } = await supabase
      .from('agendamentos')
      .insert([novoAgendamento]);
    
    if (error) {
      alert("Erro ao agendar: " + error.message);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleCellClick = (dia, hora) => {
    setSelectedSlot({ dia, hora });
    setIsModalOpen(true);
  };

  const agendamentosFiltrados = agendamentos.filter(a => 
    a.paciente_nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-blue-900 animate-pulse uppercase">
      Sincronizando...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col font-sans antialiased text-slate-700">
      
      {/* 1. HEADER PRINCIPAL */}
      <header className="bg-white border-b border-slate-200 px-6 py-2 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-[#1E293B] p-1.5 rounded-lg text-white"><Calendar size={18} /></div>
            <h1 className="text-lg font-black tracking-tighter text-[#1E293B]">
              HM <span className="font-light text-slate-400 italic">Agenda</span>
            </h1>
          </div>
          <nav className="hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="text-blue-600 border-b-2 border-blue-600 py-3 mt-1 cursor-default">Agenda</span>
            <span className="hover:text-blue-600 py-3 mt-1 cursor-pointer transition-colors">Pacientes</span>
            <span className="hover:text-blue-600 py-3 mt-1 cursor-pointer transition-colors">Gestão</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-slate-400 uppercase italic">savioalves169@gmail.com</span>
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200 cursor-help" title="Master User">S</div>
        </div>
      </header>

      {/* 2. TOOLBAR DE CONTROLE */}
      <section className="bg-white p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#2563EB]">Eveline</h2>
          <div className="relative w-64 md:w-80 ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              type="text" 
              placeholder="Busque um paciente..." 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-xs outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner" 
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all min-w-16 group">
            <Plus size={18} className="text-slate-400 group-hover:text-blue-600" /> 
            <span className="text-[9px] font-bold uppercase mt-1">Novo</span>
          </button>
          <button className="flex flex-col items-center p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all min-w-16 group">
            <List size={18} className="text-slate-400 group-hover:text-blue-600" /> 
            <span className="text-[9px] font-bold uppercase mt-1">Espera</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="flex flex-col items-center p-2 border border-slate-100 rounded-lg hover:bg-slate-50 transition-all min-w-16 group"
          >
            <Printer size={18} className="text-slate-400 group-hover:text-blue-600" /> 
            <span className="text-[9px] font-bold uppercase mt-1">Imprimir</span>
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
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-md text-[11px] font-bold text-slate-500 flex items-center gap-2 shadow-sm">
            <Calendar size={14} className="text-blue-500" /> 08/03 a 14/03
          </div>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-md p-0.5 shadow-sm">
          <button className="px-5 py-1 text-[10px] font-bold uppercase text-slate-400 hover:text-blue-600 transition-all">Dia</button>
          <button className="px-5 py-1 text-[10px] font-black uppercase bg-blue-50 text-blue-600 rounded-sm">Semana</button>
        </div>
      </div>

      {/* 4. GRADE DE AGENDA SEMANAL */}
      <main className="flex-1 overflow-auto p-4 pt-0 custom-scrollbar">
        <div className="min-w-300 bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
          {/* Cabeçalho de Datas */}
          <div className="flex border-b border-slate-200 bg-white sticky top-0 z-20">
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
                  <div 
                    key={idx} 
                    onClick={() => handleCellClick(dia, hora)}
                    className={`flex-1 border-r border-slate-100 last:border-0 relative hover:bg-blue-50/10 transition-colors cursor-pointer ${idx === 0 ? 'bg-yellow-50/5' : ''}`}
                  >
                    {agendamentosFiltrados
                      .filter(a => a.data === dia.dataISO && a.horario.startsWith(hora)) 
                      .map(item => <AppointmentCard key={item.id} appointment={item} isCompact />)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* RENDERIZAÇÃO DO MODAL */}
      <ModalAgendamento 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        slot={selectedSlot}
        onSave={onConfirmSave}
      />
    </div>
  );
}

export default App;