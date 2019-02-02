<template>
  <div class="card task-table">
    <div class="card-header">
      <div class="filter-scroller">
        <div class="filter row">
          <div class="col-auto py-2">
            <h6>Filter Releases</h6>
            <div class="form-check form-check-inline" v-for="(rls, i) of filterKeys.release" :key="rls">
              <input class="form-check-input" type="checkbox" :id="`rls${i}`" :value="`rls${i}`" @click="handleKey(rls)" checked>
              <label class="form-check-label" :for="`rls${i}`">{{ rls }}</label>
            </div>
          </div>
          <div class="col-auto py-2">
            <h6>Filter Statuses</h6>
            <div class="form-check form-check-inline" v-for="(sts, i) of filterKeys.status" :key="sts">
              <input class="form-check-input" type="checkbox" :id="`sts${i}`" :value="`sts${i}`" @click="handleKey(sts)" checked>
              <label class="form-check-label" :for="`sts${i}`">{{ sts }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="thead-dark">
            <tr>
              <th scope="col" class="text-nowrap" @click="sort('release')">Release #</th>
              <th scope="col" class="text-nowrap" @click="sort('date')">Approved</th>
              <th scope="col" class="text-long" @click="sort('title')">Deliverable</th>
              <th scope="col" @click="sort('status')">Status</th>
              <th scope="col" class="rag">Last week RAG</th>
              <th scope="col" class="rag">This week RAG</th>
              <th scope="col" class="text-long">RAG - Mitigation</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(task, i) in sortedTasks" :key="i" v-show="filterTask(task)">
              <td class="text-nowrap">{{ task.release }}</td>
              <td class="text-nowrap"><span v-if="task.date">{{ task.date | moment('MM/DD/YYYY') }}</span></td>
              <td><a :href="task.permalink" target="_blank" class="text-secondary">{{ task.title }} <i class="fas fa-external-link-alt fa-sm"></i></a></td>
              <td class="text-nowrap" :style="{ color: task.statusColor }">{{ task.status }}</td>
              <td :class="task.lastRAG"></td>
              <td :class="task.thisRAG"></td>
              <td>{{ task.RAG }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      filter: [],
      currentSort: 'release',
      currentSortDir: 'asc'
    }
  },
  props: ['process'],
  computed: {
    ...mapState(['tasks','workflows']),
    sortedTasks() {
      const taskArray = this.tasks.filter(tsk => {
        return this.process.childIds.some(rls => {
          return rls === tsk.parentIds[0]
        })
      })
      const data = []
      for (let tsk of taskArray) {
        data.push({
          release: this.filterId(tsk.customFields, process.env.VUE_APP_CUSTOM_RELEASE_ID),
          date: this.filterId(tsk.customFields, process.env.VUE_APP_CUSTOM_DATE),
          permalink: tsk.permalink,
          title: tsk.title,
          status: this.status(tsk.customStatusId),
          statusColor: this.color(tsk.customStatusId),
          lastRAG: this.rag(tsk.customFields, process.env.VUE_APP_CUSTOM_LRAG),
          thisRAG: this.rag(tsk.customFields, process.env.VUE_APP_CUSTOM_TRAG),
          RAG: this.filterId(tsk.customFields, process.env.VUE_APP_CUSTOM_RAG)
        })
      }
      return data.sort((a, b) => {
        let modifier = 1
        if (this.currentSortDir === 'desc') modifier = -1
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier
        return 0
      })
    },
    filterKeys() {
      let statusArray = []
      for (let sts of this.workflows.customStatuses) {
        statusArray.push(sts.name)
      }
      const status = statusArray.slice(0, -2)
      
      let release = []
      for (let n in this.process.childIds) {
        n++
        release.push(`Release ${n}`)
      }
      return { status, release }
    }
  },
  methods: {
    sort(col) {
      if (col === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc'
      }
      this.currentSort = col
    },
    rag (value, id) {
      let obj = value.find((obj) => obj.id === id)
      if (!obj) return ''
      if (obj.value === 'Red') return 'bg-danger'
      if (obj.value === 'Amber') return 'bg-warning'
      if (obj.value === 'Green') return 'bg-success'
      else return null
    },
    status (id) {
      let obj = this.workflows.customStatuses.find((obj) => obj.id === id)
      if (!obj) return null
      return obj.name
    },
    color (id) {
      let obj = this.workflows.customStatuses.find((obj) => obj.id === id)
      if (!obj) return null
      return obj.color
    },
    filterId (value, id) {
      let obj = value.find((obj) => obj.id === id)
      if (!obj) return ''
      return obj.value
    },
    filterTask(tsk) {
      if (this.filter.length > 0) {
        if (this.filter.includes(tsk.release) || this.filter.includes(tsk.status)) return false
      }
      return true
    },
    handleKey(key) {
      const i = this.filter.indexOf(key)
      if (i !== -1) this.filter.splice(i, 1)
      else this.filter.push(key)
    }
  }
}
</script>

<style scoped>
.table .rag {
  max-width: 70px;
}
.table .text-long {
  max-width: 300px;
  min-width: 200px;
}
.filter-scroller {
  position: relative;
  z-index: 2;
  overflow: hidden;
}
.filter-scroller .filter {
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
</style>
