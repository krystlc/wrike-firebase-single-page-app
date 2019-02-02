import axios from 'axios'

const config = {
  headers: {
    Authorization: 'Bearer ' + process.env.VUE_APP_TOKEN
  }
}

function wTasks() {
  return axios.get(
    `${process.env.VUE_APP_API_URL}/tasks?fields=["parentIds","customFields","dependencyIds","superParentIds"]&status=Active`,
    config
  )
}
function wProjects() {
  return axios.get(
    `${process.env.VUE_APP_API_URL}/folders/${process.env.VUE_APP_PID}/folders`,
    config
  )
}
function wWorkflows() {
  return axios.get(
    `${process.env.VUE_APP_API_URL}/accounts/${process.env.VUE_APP_ACCOUNT}/workflows`,
    config
  )
}

const getData = axios.all([wTasks(), wProjects(), wWorkflows()])
  .then(axios.spread((tasks, projects, workflows) => {
    return { tasks, projects, workflows }
  }))

export {
  getData
}