import { useState } from 'react';
import axios from 'axios';
import { Servicio } from '../interfaces/types';

const API_URL = 'http://192.168.1.11:3000/osorio/examen/servicios';

export const useServicios = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL);
      setServicios(data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    } finally {
      setLoading(false);
    }
  };

  const createServicio = async (servicio: Servicio): Promise<Servicio | null> => {
    try {
      const { data } = await axios.post(API_URL, servicio);
      setServicios(prev => [...prev, data]); // actualiza inmediatamente
      return data;
    } catch (error) {
      console.error('Error al crear servicio:', error);
      return null;
    }
  };

  const updateServicio = async (id: string, servicio: Partial<Servicio>): Promise<Servicio | null> => {
    try {
      const { data } = await axios.patch(`${API_URL}/${id}`, servicio);
      setServicios(prev =>
        prev.map(s => (s._id === id ? data : s))
      ); // actualiza inmediatamente
      return data;
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      return null;
    }
  };

  const deleteServicio = async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setServicios(prev => prev.filter(s => s._id !== id)); // actualiza inmediatamente
      return true;
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      return false;
    }
  };

  return {
    servicios,
    loading,
    fetchServicios,
    createServicio,
    updateServicio,
    deleteServicio,
  };
};
