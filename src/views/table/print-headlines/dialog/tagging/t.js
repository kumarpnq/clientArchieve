// import React, { useState, useEffect } from 'react'
// import Toolbar from '@mui/material/Toolbar'
// import Button from '@mui/material/Button'
// import Menu from '@mui/material/Menu'
// import MenuItem from '@mui/material/MenuItem'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
// import AppBar from '@mui/material/AppBar'
// import Grid from '@mui/material/Grid'
// import useMediaQuery from '@mui/material/useMediaQuery'
// import axios from 'axios'
// import Checkbox from '@mui/material/Checkbox'
// import ListItem from '@mui/material/ListItem'

// // ** Redux
// import { useSelector } from 'react-redux' // Import useSelector from react-redux
// import { selectSelectedClient } from 'src/store/apps/user/userSlice'

// const ToolbarComponent = ({
//   selectedCompanyIds,
//   setSelectedCompanyIds,
//   selectedMedia,
//   setSelectedMedia,
//   selectedTag,
//   setSelectedTags
// }) => {
//   const [competitionAnchor, setCompetitionAnchor] = useState(null)
//   const [geographyAnchor, setGeographyAnchor] = useState(null)
//   const [languageAnchor, setLanguageAnchor] = useState(null)
//   const [mediaAnchor, setMediaAnchor] = useState(null)
//   const [tagsAnchor, setTagsAnchor] = useState(null)
//   const [companies, setCompanies] = useState([])
//   const [languages, setLanguages] = useState({})
//   const [cities, setCities] = useState([])
//   const [media, setMedia] = useState([])
//   const [tags, setTags] = useState([])

//   // const [selectAllCompetitions, setSelectAllCompetitions] = useState(false)

//   const selectedClient = useSelector(selectSelectedClient)
//   const clientId = selectedClient ? selectedClient.clientId : null

//   const handleSelectAllCompetitions = () => {
//     const allCompanyIds = companies.map(company => company.companyId)
//     setSelectedCompanyIds(allCompanyIds)
//   }

//   const handleDeselectAllCompetitions = () => {
//     setSelectedCompanyIds([])
//   }

//   const handleSelectAllMedia = () => {
//     const allMediaIds = media.map(item => item.publicationGroupId)
//     setSelectedMedia(allMediaIds)
//   }

//   const handleSelectAllTags = () => {
//     const allTags = tags.map(item => item)
//     setSelectedTags(allTags)
//   }

//   const handleCheckboxChange = companyId => {
//     setSelectedCompanyIds(prevSelected => {
//       const isAlreadySelected = prevSelected.includes(companyId)

//       if (isAlreadySelected) {
//         // If already selected, remove from the list
//         return prevSelected.filter(id => id !== companyId)
//       } else {
//         // If not selected, add to the list
//         return [...prevSelected, companyId]
//       }
//     })
//   }

//   const handleTagSelect = item => {
//     setSelectedTags(prevSelected => {
//       const isAlreadySelected = prevSelected.includes(item)

//       if (isAlreadySelected) {
//         // If already selected, remove from the list
//         return prevSelected.filter(id => id !== item)
//       } else {
//         // If not selected, add to the list
//         return [...prevSelected, item]
//       }
//     })
//   }

//   const handleMediaSelect = publicationGroupId => {
//     setSelectedMedia(prevSelected => {
//       const isAlreadySelected = prevSelected.includes(publicationGroupId)

//       if (isAlreadySelected) {
//         // If already selected, remove from the list
//         return prevSelected.filter(id => id !== publicationGroupId)
//       } else {
//         // If not selected, add to the list
//         return [...prevSelected, publicationGroupId]
//       }
//     })
//   }

//   const [userData, setUserData] = useState({
//     email: '',
//     fullName: '',
//     clientId: '',
//     clientName: '',
//     role: ''
//   })

//   const openDropdown = (event, anchorSetter) => {
//     anchorSetter(event.currentTarget)
//   }

//   const closeDropdown = anchorSetter => {
//     anchorSetter(null)
//   }

//   const handleDropdownItemClick = () => {}

//   const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'))

//   useEffect(() => {
//     const fetchUserDataAndCompanies = async () => {
//       try {
//         const storedToken = localStorage.getItem('accessToken')
//         if (storedToken) {
//           const response = await axios.get('http://51.68.220.77:8001/companyListByClient/', {
//             headers: {
//               Authorization: Bearer ${storedToken}
//             },
//             params: {
//               clientId: clientId
//             }
//           })
//           setCompanies(response.data.companies)
//         }

//         // Fetch languages
//         const languageResponse = await axios.get('http://51.68.220.77:8001/languagelist/', {
//           headers: {
//             Authorization: Bearer ${storedToken}
//           }
//         })
//         setLanguages(languageResponse.data.languages)

//         // Fetch cities
//         const citiesResponse = await axios.get('http://51.68.220.77:8001/citieslist/', {
//           headers: {
//             Authorization: Bearer ${storedToken}
//           }
//         })
//         setCities(citiesResponse.data.cities)

//         // fetch media
//         const mediaResponse = await axios.get('http://51.68.220.77:8001/printMediaList', {
//           headers: {
//             Authorization: Bearer ${storedToken}
//           },
//           params: {
//             clientId: clientId
//           }
//         })
//         setMedia(mediaResponse.data.mediaList)

//         // fetch tags
//         const tagsResponse = await axios.get('http://51.68.220.77:8001/printClientCompanyTags', {
//           headers: {
//             Authorization: Bearer ${storedToken}
//           },
//           params: {
//             clientId: clientId
//           }
//         })
//         setTags(tagsResponse?.data?.clientTags)
//       } catch (error) {
//         console.error('Error fetching user data and companies:', error)
//       }
//     }

//     fetchUserDataAndCompanies()
//   }, [clientId])

//   return (
//     <AppBar sx={{ position: 'static' }}>
//       <Toolbar>
//         {isMobile ? (
//           <Grid container spacing={2}>
//             <Grid item xs={6}>
//               <Button
//                 endIcon={<ExpandMoreIcon />}
//                 onClick={e => openDropdown(e, setCompetitionAnchor)}
//                 color='inherit'
//                 fullWidth
//               >
//                 Competition
//               </Button>
//             </Grid>

//             <Grid item xs={6}>
//               <Button
//                 endIcon={<ExpandMoreIcon />}
//                 onClick={e => openDropdown(e, setGeographyAnchor)}
//                 color='inherit'
//                 fullWidth
//               >
//                 Geography
//               </Button>
//             </Grid>

//             <Grid item xs={6}>
//               <Button
//                 endIcon={<ExpandMoreIcon />}
//                 onClick={e => openDropdown(e, setLanguageAnchor)}
//                 color='inherit'
//                 fullWidth
//               >
//                 Language
//               </Button>
//             </Grid>

//             <Grid item xs={6}>
//               <Button
//                 endIcon={<ExpandMoreIcon />}
//                 onClick={e => openDropdown(e, setMediaAnchor)}
//                 color='inherit'
//                 fullWidth
//               >
//                 Media
//               </Button>
//             </Grid>

//             <Grid item xs={6}>
//               <Button
//                 endIcon={<ExpandMoreIcon />}
//                 onClick={e => openDropdown(e, setTagsAnchor)}
//                 color='inherit'
//                 fullWidth
//               >
//                 Tags
//               </Button>
//             </Grid>
//           </Grid>
//         ) : (
//           <>
//             <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setCompetitionAnchor)} color='inherit'>
//               Competition
//             </Button>

//             <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setGeographyAnchor)} color='inherit'>
//               Geography
//             </Button>

//             <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setLanguageAnchor)} color='inherit'>
//               Language
//             </Button>

//             <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setMediaAnchor)} color='inherit'>
//               Media
//             </Button>

//             <Button endIcon={<ExpandMoreIcon />} onClick={e => openDropdown(e, setTagsAnchor)} color='inherit'>
//               Tags
//             </Button>
//           </>
//         )}

//         {/* Competition Dropdown Menu */}
//         <Menu
//           open={Boolean(competitionAnchor)}
//           anchorEl={competitionAnchor}
//           onClose={() => closeDropdown(setCompetitionAnchor)}
//         >
//           {companies.length > 0 && (
//             <ListItem sx={{ justifyContent: 'space-between' }}>
//               <Button onClick={handleSelectAllCompetitions}>Select All</Button>
//               <Button onClick={handleDeselectAllCompetitions}>Deselect All</Button>
//             </ListItem>
//           )}

//           {companies.map(company => (
//             <MenuItem
//               key={company.companyId}
//               onClick={() => handleCheckboxChange(company.companyId)}
//               selected={selectedCompanyIds.includes(company.companyId)}
//             >
//               {company.companyName}
//             </MenuItem>
//           ))}
//         </Menu>
//         {/* Geography Dropdown Menu */}
//         <Menu
//           open={Boolean(geographyAnchor)}
//           anchorEl={geographyAnchor}
//           onClose={() => closeDropdown(setGeographyAnchor)}
//         >
//           {cities.map(city => (
//             <MenuItem key={city.cityId} onClick={handleDropdownItemClick}>
//               {city.cityName}
//             </MenuItem>
//           ))}
//         </Menu>

//         {/* Language Dropdown Menu */}
//         <Menu open={Boolean(languageAnchor)} anchorEl={languageAnchor} onClose={() => closeDropdown(setLanguageAnchor)}>
//           {Object.entries(languages).map(([languageName, languageCode]) => (
//             <MenuItem key={languageCode} onClick={handleDropdownItemClick}>
//               {languageName}
//             </MenuItem>
//           ))}
//         </Menu>
//         {/* Media Dropdown Menu */}
//         <Menu open={Boolean(mediaAnchor)} anchorEl={mediaAnchor} onClose={() => closeDropdown(setMediaAnchor)}>
//           {media.length > 0 && (
//             <ListItem sx={{ justifyContent: 'space-between' }}>
//               <Button onClick={handleSelectAllMedia}>Select All</Button>
//               <Button onClick={() => setSelectedMedia([])}>Deselect All</Button>
//             </ListItem>
//           )}
//           {media.map(item => (
//             <MenuItem
//               key={item.publicationGroupId}
//               onClick={() => handleMediaSelect(item.publicationGroupId)}
//               selected={selectedMedia.includes(item.publicationGroupId)}
//             >
//               {item.publicationName}
//             </MenuItem>
//           ))}
//           {/* Add more items as needed */}
//         </Menu>
//         {/* Tags Dropdown Menu */}

//         <Menu open={Boolean(tagsAnchor)} anchorEl={tagsAnchor} onClose={() => closeDropdown(setTagsAnchor)}>
//           {tags.length > 0 && (
//             <ListItem sx={{ justifyContent: 'space-between' }}>
//               <Button onClick={handleSelectAllTags}>Select All</Button>
//               <Button onClick={() => setSelectedTags([])}>Deselect All</Button>
//             </ListItem>
//           )}
//           {tags?.map(item => (
//             <MenuItem key={item} onClick={() => handleTagSelect(item)} selected={selectedTag.includes(item)}>
//               {item}
//             </MenuItem>
//           ))}
//           {/* Add more items as needed */}
//         </Menu>

//         {/* Repeat similar patterns for other dropdown menus */}
//       </Toolbar>
//     </AppBar>
//   )
// }

// export default ToolbarComponent


clientWisePrintArticles(
  clientIds: List[str] = Query([]),
  companyIds: List[str] = Query([]),
  geography: Optional[str] =  Query(None, title="Geography", description="The geographical location"),
  language: Optional[str] =  Query(None, title="Language", description="The language of the articles"),
  media: Optional[str] =  Query(None, title="Media", description="The publication media"),
  tags: Optional[list] =  Query(None, title="Tags", description="The article tags"),
  #ADVANCE SEARCH PARAMETERS
  headline: Optional[str] = Query(None, title="Headline", description="Headline of the article"),
  body: Optional[str] = Query(None, title="Body", description="body of the article"),
  journalist: Optional[str] = Query(None, title="Journalist", description="Journalist of the published news article"),
  wordCombo: Optional[str] = Query(None, title="Word Combination", description="Search combination of words"),
  anyWord: Optional[str] = Query(None, title="Any Word", descripton="Search any word"),
  ignoreWords: Optional[str] = Query(None, title="Ignore Words", description="Ignore Articles with these words"),
  phrase: Optional[str] = Query(None, title="Phrase", description="Search exact phrase from the body"),

  fromDate: str = Query(),
  toDate: str =  Query(),
  token: str = Depends(oauth2Scheme),
  page: int = Query(1, gt=0),
  recordsPerPage: int = Query(10, gt=0),
)
