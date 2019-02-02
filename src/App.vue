<template>
  <div id="app">
    <navbar/>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <error :err="error" v-if="error"/>
    </transition>
    <router-view/>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <loading v-if="isLoading"/>
    </transition>
  </div>
</template>

<script>
import Error from '@/components/Error'
import Navbar from '@/components/Navbar'
import Loading from '@/components/Loading'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: { Navbar, Error, Loading },
  created () {
    // eslint-disable-next-line
    console.log('by Alex Valle')
  },
  computed: {
    ...mapState(['isLoading', 'error'])
  }
}
</script>
