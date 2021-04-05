import { useEffect, useLayoutEffect } from 'react'

const useSsrLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default useSsrLayoutEffect