import { parseRoute, Route } from '@src/routing/routes'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

export type UseRouteResult = {
  loading: boolean
  route: Route | undefined
}

export default function useRoute(): UseRouteResult {
  const router = useRouter()
  const { pathname, query, isReady } = router
  const route = useMemo(() => (isReady ? parseRoute(pathname, query) : undefined), [
    pathname,
    query,
  ])
  return { route, loading: !isReady }
}
