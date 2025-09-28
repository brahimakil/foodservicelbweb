import { useQuery } from '@tanstack/react-query';
import { settingsService } from '@/services/settingsService';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
