<template>
  <div class="workstream-view">
    <div class="nav-scroller bg-white border-bottom">
      <div class="container">
        <nav class="nav nav-underline">
          <a href="#" class="nav-link text-truncate" v-for="(process, i) in processes" :key="i" @click="swapProcess(process)">
            {{ process.title }}
          </a>
        </nav>  
      </div>
    </div>
    <div class="workstream py-5" v-if="process">
      <section class="container">
        <h2 class="pb-3">{{ process.title }}</h2>
        <div class="card mb-3">
          <div class="card-body">
            <health-bar :releaseIds="process.childIds"/>
          </div>
        </div>
        <task-table :process="process"/>
      </section>
    </div>
    <div class="jumbotron" v-else>
      <div class="container">
        <h3 class="text-center jumbotron-title"><i class="fas fa-arrow-up"></i><br> Select a process</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import HealthBar from '@/components/HealthBar'
import TaskTable from '@/components/TaskTable'

export default {
  components: { HealthBar, TaskTable },
  data() {
    return {
      process: null
    }
  },
  computed: {
    ...mapState(['processes'])
  },
  methods: {
    swapProcess(process) {
      this.process = process
    }
  }
}
</script>

<style scoped>
.nav-scroller {
  position: relative;
  z-index: 2;
  height: 2.75rem;
  overflow-y: hidden;
}
.nav-scroller .nav {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  padding-bottom: 1rem;
  margin-top: -1px;
  overflow-x: auto;
  color: rgba(255, 255, 255, .75);
  text-align: center;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
.nav-underline .nav-link {
  padding: .75rem .35rem;
  font-size: .875rem;
  color: #6c757d;
  min-width: 160px
}
</style>
