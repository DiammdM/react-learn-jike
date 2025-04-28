import { getChannelAPI } from '@/apis/article';
import { useEffect, useState } from 'react';

export default function useGetChannels() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getChannelAPI();
      setChannels(res.data.channels);
    })();
  }, []);

  return { channels };
}
