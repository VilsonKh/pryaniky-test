import { useState, useCallback, useEffect } from 'react';
import { TableData } from '../types/types';
import { api } from '../api';

export const useTableData = (token: string) => {
  const [data, setData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedData = await api.fetchData(token);
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRow = useCallback((newRow: TableData) => {
    setData(prevData => [...prevData, newRow]);
  }, []);

  const updateRow = useCallback((updatedRow: TableData) => {
    setData(prevData => prevData.map(row => row.id === updatedRow.id ? updatedRow : row));
  }, []);

  const deleteRow = useCallback((id: string) => {
    setData(prevData => prevData.filter(row => row.id !== id));
  }, []);

  return { data, isLoading, fetchData, addRow, updateRow, deleteRow };
};