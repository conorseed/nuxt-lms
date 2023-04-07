<template>
  <NuxtLayout>
    <div class="flex flex-col">
      <div v-if="error?.statusCode === 404" class="prose">
        <h1>Sorry! Page not found.</h1>
        <p>This page doesn't exist.</p>
      </div>
      <div v-else class="prose">
        <h1>Uh oh.</h1>
        <p>Something went wrong. Sorry about that!</p>
      </div>
      <div class="prose mt-5">
        <p>
          <strong>{{ error?.message }}</strong>
        </p>
        <p>
          <a class="hover:cursor-pointer" title="back to the home page" @click.prevent="handleError">Go back home</a>
        </p>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const error = useError()

const handleError = () => {
  clearError({
    redirect: '/course'
  })
}
</script>