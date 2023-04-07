<template>
  <div class="prose w-full max-w-2xl h-9">
    <h1>Log in to {{ course.title }}</h1>
    <button
      class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      @click="login"
    >
      Log in with Github
    </button>
  </div>
</template>

<script setup lang="ts">
const course = await useCourse()
const supabase = useSupabaseClient()
const { fullPath, query } = useRoute()

const login = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}${fullPath}`
    }
  })

  if(error){
    console.log(error)
  }
}

// CHeck for redirect
const user = useSupabaseUser()

watchEffect(async () => {
  if(!user.value) return
  await navigateTo(query.redirectTo as string, {
    replace: true
  })
})

</script>