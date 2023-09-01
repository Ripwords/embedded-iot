import { homeOutline, homeSharp, settingsOutline, settingsSharp, bookOutline, bookSharp } from "ionicons/icons"

export const appPages = [
  {
    title: 'Home',
    url: '/menu/home/',
    iosIcon: homeOutline,
    mdIcon: homeSharp
  },
  {
    title: 'Settings',
    url: '/menu/settings/',
    iosIcon: settingsOutline,
    mdIcon: settingsSharp
  }
]

// convert appPages to vue-router routes
export const pageRoutes = appPages.map(page => {
  return {
    path: String(page.url).replace('/menu/', '').slice(0, -1),
    component: () => import(`../views/sub-views/${page.title}.vue`)
  }
})