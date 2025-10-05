import { useQuery } from '@tanstack/react-query'
import { celestialAPI } from '@/services/api'

export const useSearchObjects = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => celestialAPI.search(query),
    enabled: query.length > 2, // Only search if query is longer than 2 characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}