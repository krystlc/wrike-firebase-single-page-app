<template>
  <nav class="navbar navbar-expand-lg navbar-dark py-3" :class="!activeReport ? 'bg-primary' : 'bg-secondary'">
    <div class="container">
      <router-link to="/overview" class="navbar-brand" exact><img src="../assets/logo.svg" height="24px"/> Logo</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon" @click="isActive = !isActive"></span>
      </button>
      <div class="collapse navbar-collapse" :class="{ 'show' : isActive }">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/overview" class="nav-link">Overview</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/summary" class="nav-link">Summary</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/processes" class="nav-link">Processes</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/history" class="nav-link">History</router-link>
          </li>
        </ul>
        <span class="navbar-text mr-2" v-if="activeReport">
          Report dated {{ activeReport.created.seconds | moment('LLLL') }}
        </span>
        <button class="btn" @click="logout" v-if="currentUser" :class="!activeReport ? 'btn-primary' : 'btn-secondary'">Log out</button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
const fb = require('../firebaseConfig')

export default {
  data() {
    return {
      isActive: false
    }
  },
  watch: {
    '$route' () {
      this.isActive = false
    }
  },
  computed: {
    ...mapState(['activeReport', 'currentUser'])
  },
  methods: {
    reset() {
      this.$store.dispatch('getLatestReport')
    },
    logout() {
      fb.auth.signOut().then(() => {
        this.$store.dispatch('clearData')
        this.$router.push('/login')
      }).catch(err => {
        this.$store.commit('setError', {msg: err.message, type: 'danger'})
      })
    }
  }
}
</script>

<style scoped>
.navbar-brand img {
  margin-top: -5px;
}
</style>
