import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);
      // Busca todos os agendamentos da tabela
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .order('horario', { ascending: true });

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Erro ao sincronizar com Supabase:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();

    // Sincronização em Tempo Real (Realtime)
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agendamentos' }, () => {
        fetchAgendamentos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { agendamentos, loading, refresh: fetchAgendamentos };
}