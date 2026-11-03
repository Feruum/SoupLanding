import { useEffect } from 'react'
import type { RefObject } from 'react'
import { initScrollMotion } from './scroll-motion'
import type { ScrollGroup } from './scroll-motion'
import './scroll-motion.css'

export function useScrollMotion(
  root: RefObject<HTMLDivElement | null>,
  groups: readonly ScrollGroup[],
) {
  useEffect(() => {
    if (root.current) return initScrollMotion(root.current, groups)
  }, [root, groups])
}
