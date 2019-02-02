<template>
  <div class="reporting-view py-5">
    <section class="container">
      <h2 class="pb-3">History <button class="btn btn-primary ml-2 btn-sm" @click="create" :disabled="activeReport">Create a snapshot</button><button class="btn btn-primary ml-2 btn-sm" @click="reset" :disabled="!activeReport">Reset</button></h2>
      <div class="card">
        <div class="card-body p-0" v-if="library">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="thead-light">
                <tr>
                  <th>Snapshot</th>
                  <th colspan="2">Created by</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(report, i) in library" :key="i">
                  <td class="text-muted">
                    <button class="btn badge badge-info mr-2 align-middle text-uppercase" @click="load(report)">Load snapshot</button>
                    {{ report.created.seconds | moment('LLLL')}}
                  </td>
                  <td class="text-center">{{ report.userEmail ? report.userEmail : '-' }}</td>
                  <td class="text-center">
                    <button type="button" class="close" aria-label="Close" @click="del(report.reportId)">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </td>
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
  computed: {
    ...mapState(['library', 'activeReport'])
  },
  methods: {
    create() {
      this.$store.dispatch('createReport')
    },
    load(report) {
      this.$store.dispatch('loadReport', report)
    },
    reset() {
      this.$store.dispatch('getLatestReport')
    },
    del(id) {
      const r = confirm(`Are you sure you want to delete this report?`)
      if (r) this.$store.dispatch('deleteReport', id)
    }
  }
}
</script>
