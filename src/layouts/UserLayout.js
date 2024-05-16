import useMediaQuery from '@mui/material/useMediaQuery'
import { useEffect, useState } from 'react'

// *third party imports
import axios from 'axios'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { BASE_URL } from 'src/api/base'

// ** redux import
import { useSelector, useDispatch } from 'react-redux'
import { selectSelectedClient, setCustomDashboardScreens } from 'src/store/apps/user/userSlice'
import useScreenPermissions from 'src/hooks/useScreenPermissions'

const UserLayout = ({ children, contentHeightFixed }) => {
  // ** redux
  const selectedClient = useSelector(selectSelectedClient)
  const clientId = selectedClient ? selectedClient.clientId : null
  const dispatch = useDispatch()
  const screenPermissions = useScreenPermissions()

  const [navItems, setNavItems] = useState([])

  useEffect(() => {
    const newNavItems = [
      {
        title: 'Dashboards',
        icon: 'tabler:smart-home',
        badgeColor: 'error',
        children: [
          {
            title: 'My Dashboard',
            path: '/dashboards/custom'
          },
          {
            title: 'Clouds',
            path: '/dashboards/clouds',
            icon: 'clarity:analytics-line'
          },
          screenPermissions.printDashboard && {
            title: 'Print',
            path: '/dashboards/print',
            icon: 'arcticons:mobile-print'
          },
          screenPermissions.onlineDashboard && {
            title: 'Online',
            path: '/dashboards/online',
            icon: 'fluent-mdl2:join-online-meeting'
          },
          screenPermissions.visibilityImageQE && {
            title: 'Visibility Image QE',
            path: '/dashboards/visibility-image-qe',
            icon: 'mage:chart-up'
          },
          {
            title: 'Visibility & Count ',
            path: '/dashboards/visibility-&-count',
            icon: 'oui:token-token-count'
          },
          {
            title: 'Tonality',
            path: '/dashboards/tonality',
            icon: 'material-symbols-light:tonality'
          },
          {
            title: 'Peers',
            path: '/dashboards/peers',
            icon: 'line-md:peertube-alt'
          },
          {
            title: 'Performance',
            path: '/dashboards/performance',
            icon: 'mingcute:performance-fill'
          },
          {
            title: 'KPI Peers',
            path: '/dashboards/kpi-peers',
            icon: 'carbon:summary-kpi-mirror'
          }
        ]
      },
      screenPermissions.onlineHeadlines && {
        title: 'Online Headlines',
        icon: 'fluent-mdl2:news-search',
        path: '/headlines/online',
        hidden: !screenPermissions.onlineHeadlines
      },
      screenPermissions.onlineHeadlines && {
        title: 'Print Headlines',
        icon: 'emojione-monotone:newspaper',
        path: '/headlines/print',
        hidden: !screenPermissions.printHeadlines
      },
      screenPermissions.bothHeadlines && {
        title: 'Print & Online Headlines',
        icon: 'material-symbols:article-shortcut-outline-rounded',
        path: '/headlines/print-online',
        hidden: !screenPermissions.bothHeadlines
      }
    ]

    // Filter out undefined elements
    const filteredNavItems = newNavItems.filter(item => item)
    setNavItems(filteredNavItems)
  }, [screenPermissions])

  // ** Hooks
  const { settings, saveSettings } = useSettings()

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()
  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }
  const items = VerticalNavItems()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('accessToken')
        const url = `${BASE_URL}/userDashboardList`

        const headers = {
          Authorization: `Bearer ${storedToken}`
        }

        const request_data = {
          clientId: clientId // Replace with your request data
        }

        const response = await axios.get(url, {
          headers: headers,
          params: request_data
        })
        dispatch(setCustomDashboardScreens(response.data.userDashboardList))
      } catch (error) {
        console.error('Error fetching user dashboard data:', error)
      }
    }

    fetchData()
  }, [clientId, dispatch])

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: navItems

          // Uncomment the below line when using server-side menu in vertical layout and comment the above line
          // navItems: verticalMenuItems
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems()

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
    >
      {children}
    </Layout>
  )
}

export default UserLayout
