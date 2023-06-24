import { getPlatforms, toastController } from '@ionic/vue'
import { GoogleAuthProvider, getAuth, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { getDatabase, ref, onValue } from 'firebase/database'
import { useRoute } from 'vue-router'

export const getPageName = () => {
  const route = useRoute()
  // Capitalize first letter
  return route.path.split('/')[2].charAt(0).toUpperCase() + route.path.split('/')[2].slice(1)
}

export const formatTime = (time: number) => {
  let unit
  // Start from weeks
  if (time > 604800000) {
    time = Math.floor(time / 604800000)
    unit = 'w'
  } else if (time > 86400000) {
    time = Math.floor(time / 86400000)
    unit = 'd'
  } else if (time > 3600000) {
    time = Math.floor(time / 3600000)
    unit = 'h'
  } else if (time > 60000) {
    time = Math.floor(time / 60000)
    unit = 'm'
  } else if (time > 1000) {
    time = Math.floor(time / 1000)
    unit = 's'
  }
  return `${time}${unit}`
}

export const formatFullTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = (minutes % 60).toString().padStart(2, '0')
  const formattedSeconds = (seconds % 60).toString().padStart(2, '0')
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}


export const isDesktop = () => {
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
    return false
  } else {
    return true
  }
}

export const initDB = async (email: string, pinia: any) => {
  const db = getDatabase()
  email = email.replace('.', '')
  const dbRef = ref(db, `${email}/`)
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val()
    pinia.data = data
  })
}

export const signInGoogle = async (router: any) => {
  const provider = new GoogleAuthProvider()
  const auth = getAuth()
  if (!isDesktop) {
    await signInWithRedirect(auth, provider)
  } else {
    const result = await signInWithPopup(auth, provider)
    if (result !== undefined) {
      router.replace('/menu')
    }
  }
}

export const convertUnixToTime = (unix: any) => {
  const date = new Date(unix * 1000)
  if (date.getHours() < 10) {
    return `0${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  } else if (date.getMinutes() < 10) {
    return `${date.getHours()}:0${date.getMinutes()}:${date.getSeconds()}`
  } else if (date.getSeconds() < 10) {
    return `${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`
  } else {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }
}

export const notify = async (position: 'top' | 'bottom' | 'middle', message: string) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    position: position
  })
  await toast.present()
}

export const errorHandler = (error: string) => {
  console.log(error)
  switch (error) {
    case 'auth/invalid-email':
      return 'Invalid email address'
    case 'auth/user-disabled':
      return 'User has been disabled'
    case 'auth/user-not-found':
      return 'User not found'
    case 'auth/wrong-password':
      return 'Wrong password'
    case 'auth/internal-error':
      return 'Internal error'
    case 'auth/email-already-in-use':
      return 'Email address is already in use'
    case 'auth/weak-password':
      return 'Password is too weak'
    default:
      return 'Unknown error'
  }
}