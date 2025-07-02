// src/hooks/useAutos.ts
import { useState } from 'react';
import { Auto } from '../interfaces/auto';

const API_URL = 'http://192.168.1.11:3000/autos';

export const useAutos = () => {
  const [autos, setAutos] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAutos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setAutos(data);
      setError(null);
    } catch (err) {
      setError('Error al obtener autos');
    }
    setLoading(false);
  };

  const addAuto = async (auto: Auto) => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auto),
      });
      const data = await res.json();
      setAutos(prev => [...prev, data]);
      setError(null);
    } catch (err) {
      setError('Error al agregar auto');
    }
    setLoading(false);
  };

  const updateAuto = async (id: string, auto: Partial<Auto>) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auto),
      });
      const data = await res.json();
      setAutos(prev => prev.map(a => (a._id === id ? data : a)));
      setError(null);
    } catch (err) {
      setError('Error al actualizar auto');
    }
    setLoading(false);
  };

  const deleteAuto = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setAutos(prev => prev.filter(a => a._id !== id));
      setError(null);
    } catch (err) {
      setError('Error al borrar auto');
    }
    setLoading(false);
  };

  return { autos, loading, error, fetchAutos, addAuto, updateAuto, deleteAuto };
};
