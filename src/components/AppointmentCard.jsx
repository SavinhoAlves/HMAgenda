import React from 'react';
import { Phone, Clock } from 'lucide-react';

const AppointmentCard = ({ appointment, isCompact }) => {
  const typeStyles = {
    'particular': 'bg-red-500 text-white',
    'retorno': 'bg-orange-400 text-white',
    'socio amigo': 'bg-purple-600 text-white',
    'confirmado': 'bg-emerald-500 text-white',
    'default': 'bg-slate-100 text-slate-600'
  };

  const style = typeStyles[appointment?.tipo?.toLowerCase().trim()] || typeStyles.default;

  return (
    <div className={`absolute inset-x-1 inset-y-0.5 rounded px-2 py-0.5 flex flex-col justify-center overflow-hidden cursor-pointer hover:brightness-110 shadow-sm transition-all ${style}`}>
      <span className="text-[10px] font-black uppercase truncate leading-none">
        {appointment?.paciente_nome}
      </span>
      {!isCompact && (
        <span className="text-[8px] opacity-80 font-bold uppercase truncate">
          {appointment?.tipo}
        </span>
      )}
    </div>
  );
};

// ESTA LINHA RESOLVE O ERRO DE SYNTAX
export default AppointmentCard;