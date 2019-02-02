import Vue from 'vue'
import Vuex from 'vuex'
const api = require('./api')
const fb = require('./firebaseConfig')

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    tasks: [],
    error: null,
    projects: [],
    processes: [],
    workflows: [],
    library: null,
    activeReport: null,
    currentUser: null,
    isLoading: false
  },
  actions: {
    clearData({commit}) {
      commit('setCurrentUser', null)
    },
    getLatestReport({dispatch, commit}) {
      store.commit('setLoading', true)
      api.getData.then(payload => {
        let data = {
          tasks: payload.tasks.data.data,
          projects: payload.projects.data.data,
          workflows: payload.workflows.data.data
        }
        dispatch('filterData', data)
        commit('setDate', null)
      })
    },
    filterData({commit}, data) {
      // sort array by a given key
      function sortData(items, key) {
        function compare(a, b) {
          if (a[key] < b[key]) return -1
          if (a[key] > b[key]) return 1
          return 0
        }
        return items.sort(compare)
      }
      // filter business processes
      function filteredProcesses() {
        let processIds = data.projects[0].childIds
        let processes = data.projects.filter(prs => {
          return processIds.some(f => {
            return f === prs.id
          })
        })
        return sortData(processes, 'title')
      }
      // filter valid tasks
      function filteredTasks() {
        const filtered = data.tasks.filter(tsk => {
          return tsk.customFields.some(f => {
            return f.id === process.env.VUE_APP_CUSTOM_RELEASE_ID
          })
        })
        const releaseIds = []
        filteredProcesses().forEach(prs => {
          for (let rls of prs.childIds) {
            releaseIds.push(rls)
          }
          releaseIds.push(prs.id)
        })
        const tasks = filtered.filter(tsk => {
          return releaseIds.some(f => {
            return f === tsk.parentIds[0]
          })
        })
        store.commit('setLoading', false)
        return tasks
      }
      // filter out netsuite workflow
      function filteredWorkflows() {
        return data.workflows.find(w => w.id === process.env.VUE_APP_WFLOW_ID)
      }
      commit('setTasks', filteredTasks())
      commit('setProjects', data.projects) // no need to filter
      commit('setProcesses', filteredProcesses())
      if (data.workflows) commit('setWorkflows', filteredWorkflows())
    },
    createReport({commit, state}) {
      store.commit('setLoading', true)
      let data = {
        tasks: state.tasks,
        projects: state.projects
      }
      fb.reportsCollection.add(data).then(report => {
        let details = {
          created: new Date(),
          reportId: report.id,
          userId: state.currentUser.uid,
          userEmail: state.currentUser.email
        }
        fb.libraryCollection.add(details).then(() => {
          store.commit('setLoading', false)
        }).catch(err => {
          commit('setError', {msg: err.message, type: 'warning'})
        })
      }).catch(err => {
        commit('setError', {msg: err.message, type: 'warning'})
      })
    },
    loadReport({dispatch, commit}, report) {
      const docRef = fb.reportsCollection.doc(report.reportId)
      docRef.get().then(doc => {
        if (doc.exists) {
          dispatch('filterData', doc.data())
          commit('setDate', report)
        } else {
          commit('setError', {msg: 'There is no report by that ID.', type: 'warning'})
        }
      }).catch(err => {
        commit('setError', {msg: err.message, type: 'warning'})
      })
    },
    deleteReport({state, commit}, id) {
      const recordRef = fb.libraryCollection.where('reportId', '==', id)
      recordRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete()
        })
      })
      fb.reportsCollection.doc(id).delete().then().catch(err => {
        commit('setError', {msg: err.message, type: 'warning'})
      })
      if (state.activeReport) {
        if (state.activeReport.reportId === id) commit('setDate', null)
      }
    }
  },
  mutations: {
    setTasks(state, val) {
      state.tasks = val
    },
    setProjects(state, val) {
      state.projects = val
    },
    setProcesses(state, val) {
      state.processes = val
    },
    setWorkflows(state, val) {
      state.workflows = val
    },
    setLibrary(state, val) {
      state.library = val
    },
    setDate(state, val) {
      state.activeReport = val
    },
    setCurrentUser(state, val) {
      state.currentUser = val
    },
    setLoading(state, val) {
      state.isLoading = val
    },
    setError(state, val) {
      state.error = val
      setTimeout(() => {
        state.error = null
      }, 3000)
    }
  }
})

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch('getLatestReport')
    store.commit('setCurrentUser', user)
    fb.libraryCollection.orderBy('created','desc').onSnapshot(querySnapshot => {
      let library = []
      querySnapshot.forEach(doc => {
        library.push(doc.data())
      })
      store.commit('setLibrary', library)
    })
  }
})
