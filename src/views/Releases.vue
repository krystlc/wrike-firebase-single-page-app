<template>
  <div class="releases-view py-5">
    <section class="container">
      <h2 class="pb-3">Summary</h2>
      <div class="card mb-3">
        <div class="card-header">
          Process by Release
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover text-center mb-0">
              <thead class="thead-dark">
                <tr>
                <th>Business Processes</th>
                <th v-for="(n, i) in 4" :key="i" class="text-nowrap">Release {{ n }}</th>
                <th>Backlog</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <td><strong>Total</strong></td>
                  <td v-for="(release, i) in totals" :key="i"><span v-if="release.completed >= 0">{{ release.completed }} / </span>{{ release.total }}</td>
                </tr>
              </tfoot>
              <tbody>
                <tr v-for="(process, i) in byProcess" :key="i">
                  <td>{{ process.title }}</td>
                  <td v-for="(result, i) in process.releases" :key="i"><span v-if="result.completed >= 0">{{ result.completed }} / </span>{{ result.total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          Status by Release
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover text-center mb-0">
              <thead class="thead-dark">
                <tr>
                  <th>Release Dashboard</th>
                  <th v-for="(n, i) in 4" :key="i" class="text-nowrap">Release {{ n }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(status, i) in byStatuses" :key="i">
                  <td>{{ status.title }}</td>
                  <td v-for="(total, i) in status.totals" :key="i" :class="cellColor(status, total, i)">{{ total }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      totals: [],
      endDates: []
    }
  },
  computed: {
    ...mapState(['tasks', 'projects', 'workflows', 'processes']),
    byProcess() {
      // collect process tasks
      const processes = []
      this.processes.forEach(el => {
        // collect and sort releases
        const sortedReleases = this.projects.filter(rls => {
          return el.childIds.some(f => {
            return f === rls.id
          })
        })
        this.sortBy(sortedReleases, 'title')

        // collect tasks by release
        const releases = []
        sortedReleases.forEach(rls => {
          const tasks = this.tasks.filter(tsk => rls.id === tsk.parentIds[0])
          releases.push(this.calcTasks(tasks))
        })
        // collect process backlog
        const backlog = this.tasks.filter(tsk => {
          return tsk.parentIds[0] === el.id
        })
        releases.push({ total: backlog.length })

        // ship it
        processes.push({
          title: el.title,
          releases
        })
      })
      this.calcTotals(processes)
      return processes
    },
    byStatuses() {
      // get active statuses
      let active = []
      if (this.workflows.customStatuses) {
        active = this.workflows.customStatuses.filter(w => w.group === 'Active' || w.group === 'Completed')
      }

      const releases = this.projects.filter(prs => {
        return this.processes[0].childIds.some(f => {
          return f === prs.id
        })
      })
      this.sortBy(releases, 'title')
      // eslint-disable-next-line
      this.endDates = releases

      const tasks = []
      // group tasks by release
      releases.forEach((rel, i) => {
        const taskSet = this.tasks.filter(tsk => {
          return tsk.customFields.some(f => {
            return f.value === `Release ${i+1}`
          })
        })
        tasks.push(taskSet)
      })

      const statuses = []
      // loop through active status tasks
      active.forEach(sts => {
        statuses.push({
          title: sts.name,
          totals: this.calcStatus(tasks, sts)
        })
      })
      return statuses
    }
  },
  methods: {
    sortBy(data, val) {
      function compare(a, b) {
        if (a[val] < b[val]) return -1
        if (a[val] > b[val]) return 1
        return 0
      }
      return data.sort(compare)
    },
    calcTotals(data) {
      const releases = []
      if (data.length > 0) {
        data[0].releases.forEach((value, i) => {
          let sumComplete = 0
          let sumTotal = 0
          data.forEach(process => {
            sumComplete += process.releases[i].completed
            sumTotal += process.releases[i].total
          })
          releases.push({
            completed: sumComplete,
            total: sumTotal
          })
        })
        this.totals = releases
      }
    },
    calcTasks(data) {
      let completed = 0
      // sum up completed tasks
      for (let tsk of data) {
        const id = tsk.customStatusId
        if (
          id === process.env.VUE_APP_CUSTOM_STATUS_DONE ||
          id === process.env.VUE_APP_CUSTOM_STATUS_READY ||
          id === process.env.VUE_APP_CUSTOM_STATUS_UAT
        )
          completed++
      }
      return { completed, total: data.length }
    },
    calcStatus(data, status) {
      const obj = []
      for (let rls of data) {
        const totalTsks = rls.filter(obj => obj.customStatusId === status.id)
        obj.push(totalTsks.length)
      }
      return obj
    },
    cellColor(status, total, n) {
      const today = new Date()
      const t = status.title
      // if tasks totals 0, it passes as normal
      if (total > 0) {
        if (t === 'Open' || t === 'In Progress' || t === 'BPO Testing') {
          for (let [i, rls] of this.endDates.entries()) {
            // if release date is less than 15 days from now, pass as danger
            if (n === i && new Date(rls.project.endDate) < today.setDate(today.getDate() + 15)) {
              return 'text-danger'
            }
          }
        }
      }
    }
  }
}
</script>
