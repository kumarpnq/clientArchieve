import { useCallback, useState } from 'react'

function useMenu() {
  const [anchorEl, setAnchorEl] = useState(null)

  const openMenu = useCallback(function (e) {
    setAnchorEl(e.currentTarget)
  }, [])

  const closeMenu = useCallback(function () {
    setAnchorEl(null)
  }, [])

  return { anchorEl, openMenu, closeMenu }
}

export default useMenu
