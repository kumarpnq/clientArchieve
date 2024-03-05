// ClientListDropdown.js
import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedClient, selectSelectedClient, selectUserData } from 'src/store/apps/user/userSlice'
import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'

const ClientListDropdown = () => {
  const dispatch = useDispatch()
  const userData = useSelector(selectUserData)
  const selectedClient = useSelector(selectSelectedClient)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClientClick = selectedClient => {
    dispatch(setSelectedClient(selectedClient))
    setAnchorEl(null) // Close the options menu
  }

  const handleIconClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const clientList = useMemo(() => (userData ? userData.clientList : []), [userData])

  // Automatically select the client with the minimum sortOrder on mount
  useEffect(() => {
    if (clientList.length > 0 && !selectedClient) {
      const clientWithMinSortOrder = clientList.reduce(
        (minClient, currentClient) => (currentClient.sortOrder < minClient.sortOrder ? currentClient : minClient),
        clientList[0]
      )

      dispatch(setSelectedClient(clientWithMinSortOrder))
    }
  }, [clientList, dispatch, selectedClient])

  const options = clientList.map((client, index) => ({
    text: client.clientName,
    menuItemProps: {
      key: index,
      sx: { py: 2 },
      selected: selectedClient && selectedClient.clientId === client.clientId,
      onClick: () => handleClientClick(client)
    }
  }))

  return (
    <>
      <OptionsMenu
        iconButtonProps={{ color: 'primary' }}
        icon={
          <Icon
            fontSize='1.625rem'
            icon='ant-design:user-switch-outlined'
            onClick={handleIconClick}
            style={{ cursor: 'pointer' }}
          />
        }
        menuProps={{ sx: { '& .MuiMenu-paper': { mt: 4.25, minWidth: 200 } } }}
        options={options}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      />
    </>
  )
}

export default ClientListDropdown
