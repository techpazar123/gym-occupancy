import { useState, useEffect, useCallback } from 'react';
import { fetchOccupancy } from '../api';

export function useOccupancy() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const occ = await fetchOccupancy();
      setData(occ);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [refresh]);

  return { data, error, refresh };
}
