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
import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { BASE_URL } from 'src/api/base'

// ** redux import
import { useSelector, useDispatch } from 'react-redux'
import {
  fetchAfterReportsChanges,
  selectSelectedClient,
  setCustomDashboardScreens,
  setFetchAfterReportsChange
} from 'src/store/apps/user/userSlice'
import useScreenPermissions from 'src/hooks/useScreenPermissions'

const UserLayout = ({ children, contentHeightFixed }) => {
  // ** redux
  const selectedClient = useSelector(selectSelectedClient)
  const fetchAfterChange = useSelector(fetchAfterReportsChanges)
  const clientId = selectedClient ? selectedClient.clientId : null
  const dispatch = useDispatch()
  const screenPermissions = useScreenPermissions()

  const [navItems, setNavItems] = useState([])
  const [dynamicScreens, setDynamicScreens] = useState(null)

  useEffect(() => {
    const newNavItems = [
      {
        title: 'Dashboards',
        icon: 'tabler:smart-home',
        badgeColor: 'error',
        children: [
          ...(dynamicScreens || []),
          screenPermissions.wordClouds && {
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
          screenPermissions.visibilityAndCount && {
            title: 'Visibility & Count ',
            path: '/dashboards/visibility-&-count',
            icon: 'oui:token-token-count'
          },
          screenPermissions.tonality && {
            title: 'Tonality',
            path: '/dashboards/tonality',
            icon: 'material-symbols-light:tonality'
          },
          screenPermissions.peers && {
            title: 'Peers',
            path: '/dashboards/peers',
            icon: 'line-md:peertube-alt'
          },
          screenPermissions.performance && {
            title: 'Performance',
            path: '/dashboards/performance',
            icon: 'mingcute:performance-fill'
          },
          screenPermissions.kpiPeers && {
            title: 'KPI Peers',
            path: '/dashboards/kpi-peers',
            icon: 'carbon:summary-kpi-mirror'
          },
          screenPermissions.publication && {
            title: 'Publication',
            path: '/dashboards/publication',
            icon: 'ic:baseline-public'
          },
          screenPermissions.journalist && {
            title: 'Journalist',
            path: '/dashboards/journalist',
            icon: 'oui:reporter'
          }
        ].filter(item => item)
      },
      screenPermissions.onlineHeadlines && {
        title: 'Online News',
        icon: 'fluent-mdl2:news-search',
        path: '/headlines/online',
        hidden: !screenPermissions.onlineHeadlines
      },
      screenPermissions.onlineHeadlines && {
        title: 'Print News',
        icon: 'emojione-monotone:newspaper',
        path: '/headlines/print',
        hidden: !screenPermissions.printHeadlines
      },
      screenPermissions.bothHeadlines && {
        title: 'Print & Online News',
        icon: 'material-symbols:article-shortcut-outline-rounded',
        path: '/headlines/print-online',
        hidden: !screenPermissions.bothHeadlines
      },
      screenPermissions.socialMedia && {
        title: 'Social Media',
        icon: 'icon-park-outline:market-analysis',
        path: '/media'
      }
    ].filter(item => item)

    setNavItems(newNavItems)
  }, [screenPermissions, dynamicScreens])

  // ** Hooks
  const { settings, saveSettings } = useSettings()

  // ** Vars for server side navigation

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
          clientId: clientId
        }

        const response = await axios.get(url, {
          headers: headers,
          params: request_data
        })

        const list = response.data.userDashboardList
        const screens = list.map(i => i.userDashboardName) || []
        setDynamicScreens(() => {
          const dynamicScreensArray = []

          screens?.forEach(name => {
            const formattedName = name.toLowerCase().replace(/\s+/g, '-')

            const screen = {
              title: name,
              path: `/dashboards/${formattedName}`
            }
            dynamicScreensArray.push(screen)
          })

          return dynamicScreensArray
        })
        dispatch(setCustomDashboardScreens(list))
        dispatch(setFetchAfterReportsChange(false))
      } catch (error) {
        console.error('Error fetching user dashboard data:', error)
      }
    }

    fetchData()
  }, [clientId, dispatch, fetchAfterChange])

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
