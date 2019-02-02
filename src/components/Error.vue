<template>
  <section class="container">
    <div class="row">
      <div class="col">
        <div class="alert mt-5" :class="'alert-' + err.type" role="alert">
          <p class="m-0">{{ err.msg }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['err']
}
</script>
