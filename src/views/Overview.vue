<template>
  <div class="overview-view py-5">
    <section class="container">
      <h2 class="pb-3">Overview</h2>
      <div class="card process-health mb-3" v-for="(process, i) in processes" :key="i" >
        <div class="card-header">{{ process.title }}</div>
          <div class="card-body">
            <health-bar :releaseIds="process.childIds"/>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HealthBar from '@/components/HealthBar'

export default {
  components: { HealthBar },
  computed: {
    ...mapState(['processes'])
  },
  methods: {
    sortBy(val) {
      // sort processes alphabetically
      function compare(a, b) {
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return 0
      }
      return val.sort(compare)
    }    
  }
}
</script>
