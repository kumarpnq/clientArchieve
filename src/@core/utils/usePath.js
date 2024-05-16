import { useRouter } from 'next/router'

const usePath = () => {
  const router = useRouter()

  return {
    currentPath: router.pathname,
    asPath: router.asPath
  }
}

export default usePath
