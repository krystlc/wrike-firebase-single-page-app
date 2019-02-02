<template>
  <div class="loading text-muted">
    <h1 class="display-4 text-center">
      <i class="fas fa-spinner fa-pulse"></i>
    </h1>
  </div>
</template>

<style>
.loading {
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(248, 249, 250, 0.75);
}
.loading h1 {
  width: 100%;
}
</style>
