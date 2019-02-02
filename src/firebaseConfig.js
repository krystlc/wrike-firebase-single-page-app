import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: '', // add firebase api key token
  authDomain: '', // add authorized domain
  databaseURL: '', // add db domain
  projectId: '' // add project id
}

firebase.initializeApp(config)

const db = firebase.firestore()
const auth = firebase.auth()

const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

const libraryCollection = db.collection('library')
const reportsCollection = db.collection('reports')

export { db, auth, reportsCollection, libraryCollection }
