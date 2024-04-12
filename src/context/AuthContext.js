// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Redux
import { useDispatch, useSelector } from 'react-redux'
import { setUserData, selectUserData } from 'src/store/apps/user/userSlice'
import { clearUserData } from 'src/store/apps/user/userSlice'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** Redux
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)

  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        dispatch(setUserData(JSON.parse(localStorage.getItem('userData', userData))))
        setLoading(false)

        // await axios
        //   .get('http://51.68.220.77:8001' + authConfig.meEndpoint, {
        //     headers: {
        //       Authorization: storedToken
        //     }
        //   })
        //   .then(async response => {
        //     setLoading(false)
        //     dispatch(setUserData(response.data.userData)) // Set user data in Redux
        //   })
        //   .catch(() => {
        //     localStorage.removeItem('userData')
        //     localStorage.removeItem('refreshToken')
        //     localStorage.removeItem('accessToken')
        //     setUser(null)
        //     setLoading(false)
        //     if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
        //       router.replace('/login')
        //     }
        //   })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const { accessToken, userData, defaultScreen } = response.data

        console.log('repsomse==>', defaultScreen)
        // Store data in localStorage
        params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken) : null
        window.localStorage.setItem('userData', JSON.stringify(userData))

        // Set user data in Redux
        dispatch(setUserData(userData))

        const returnUrl = router.query.returnUrl
        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        if (defaultScreen.option === 'printHeadlines') {
          router.replace('/headlines/print/')
        } else if (defaultScreen.option === 'onlineHeadlines') {
          router.replace('/headlines/online/')
        } else if (defaultScreen.option === 'bothHeadlines') {
          router.replace('/headlines/print-online/')
        } else {
          router.replace('/dashboards/analytics/')
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    // Set local state to null
    setUser(null)

    // Dispatch the action to clear user data in Redux
    dispatch(clearUserData())

    // Clear data in localStorage
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)

    // Navigate to the login page
    router.push('/login')
  }

  const values = {
    user: userData, // Use data from Redux store,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
