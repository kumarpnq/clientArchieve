// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const Menu = () => {
  return {
    MuiMenu: {
      variants: [
        {
          props: { variant: 'translucent' },
          style: ({ theme }) => ({
            '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
              marginTop: '8px',
              padding: '2px',
              borderRadius: '8px',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
              backdropFilter: 'blur(2px)',
              backgroundColor: hexToRGBA(theme.palette.background.paper, 0.8),

              // boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
              border: '1px solid',
              borderColor: theme.palette.divider
            },
            '& .MuiButtonBase-root:hover': {
              backgroundColor: theme.palette.background.default
            }
          })
        }
      ],
      styleOverrides: {
        paper: ({ theme }) => ({
          '& .MuiMenuItem-root .MuiCheckbox-root.Mui-checked path:first-of-type': {
            fill: theme.palette.common.white
          },
          '& .MuiMenuItem-root .MuiCheckbox-root.Mui-checked path:last-of-type': {
            fill: theme.palette.primary.main,
            stroke: theme.palette.primary.main
          }
        })
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2, 4),
          margin: theme.spacing(0, 2, 1),
          borderRadius: theme.shape.borderRadius,
          '&:last-child': {
            marginBottom: 0
          },
          '&:not(.Mui-focusVisible):hover': {
            color: theme.palette.primary.main,
            backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08),
            '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemSecondaryAction-root .MuiIconButton-root':
              {
                color: theme.palette.primary.main
              }
          },
          '&.Mui-selected': {
            color: `${theme.palette.common.white} !important`,
            backgroundColor: `${theme.palette.primary.main} !important`,
            '&.Mui-focusVisible': {
              backgroundColor: `${theme.palette.primary.dark} !important`
            },
            '& .MuiListItemIcon-root, & .MuiListItemText-primary, & .MuiListItemText-secondary, & .MuiListItemSecondaryAction-root .MuiIconButton-root':
              {
                color: `${theme.palette.common.white} !important`
              }
          }
        })
      },
      defaultProps: {
        disableRipple: true
      }
    }
  }
}

export default Menu
