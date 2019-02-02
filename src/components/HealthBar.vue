<template>
  <div class="row health-bar">
    <div class="col-md mb-sm-2 mb-md-0" v-for="(release, i) in releases" :key="i">
      <h6>{{ release.title }}</h6>
      <div class="progress mb-1" style="height: 10px">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
          style="width: 100%"
          :class="status(release.project.status)"
        ></div>
      </div>
      <div class="clearfix">
        <small class="float-left">{{ release.project.startDate | moment('MMM Do \'YY') }}</small>
        <small class="float-right">{{ release.project.endDate | moment('MMM Do \'YY') }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['releaseIds'],
  computed: {
    ...mapState(['projects']),
    releases() {
      function compare(a,b) {
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return 0
      }
      const releaseArray = this.projects.filter(rls => {
        return this.releaseIds.some(id => {
          return id === rls.id
        })
      })
      return releaseArray.sort(compare)
    }
  },
  methods: {
    status (value) {
      if (!value) return null
      if (value === 'Red') return 'bg-danger'
      if (value === 'Yellow') return 'bg-warning'
      if (value === 'Green') return 'bg-success'
      return null
    }
  }
}
</script>
