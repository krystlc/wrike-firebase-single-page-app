<template>
  <div class="overview-view py-5">
    <section class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-auto">
          <div class="card w-lg-25 mx-auto">
            <div class="card-header">
              {{ forgot ? 'Request password reset' : 'Sign in' }}
            </div>
            <div class="card-body">
              <form @submit.prevent="signIn" v-if="!forgot">
                <div class="form-group">
                  <label for="Email">Email</label>
                  <input type="email" class="form-control" id="Email" v-model="email">
                </div>
                <div class="form-group">
                  <label for="Pass">Password</label>
                  <input type="password" class="form-control" id="Pass" v-model="password" autocomplete="password">
                </div>
                <button type="submit" class="btn btn-primary">Sign in</button>
              </form>
              <form @submit.prevent="forgotPassword" v-else>
                <div class="form-group">
                  <label for="Email">Email</label>
                  <input type="email" class="form-control" id="Email" v-model="email">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
            </div>
            <div class="card-footer text-right">
              <small><a href="#" @click="forgot = !forgot">{{ forgot ? 'Sign in' : 'Forgot your password?' }}</a></small>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require('../firebaseConfig')

export default {
  data() {
    return {
      email: '',
      password: '',
      forgot: false
    }
  },
  methods: {
    signIn() {
      fb.auth.signInWithEmailAndPassword(this.email, this.password).then(user => {
        this.$store.commit('setCurrentUser', user)
        this.$router.push('/overview')
      }).catch(err => {
        this.$store.commit('setError', {msg: err.message, type: 'warning'})
      })
    },
    forgotPassword() {
      fb.auth.sendPasswordResetEmail(this.email).then(() => {
        this.$store.commit('setError', {msg: 'Check your email inbox.', type: 'success'})
        this.email = ''
        this.forgot = false
      }).catch(err => {
        this.$store.commit('setError', {msg: err.message, type: 'warning'})
      })
    }
  }
}
</script>
