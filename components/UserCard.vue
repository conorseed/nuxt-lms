<template>
  <div v-if="user" class="rounded p-3 flex items-center space-x-3 bg-white">
    <img
      class="rounded-full w-12 h-12 border-2 border-blue-400"
      :src="profile"
    />
    <div class="text-right flex flex-col">
      <div class="font-medium">{{ name }}</div>
      <NuxtLink class="text-sm underline text-slate-500" :to="firstLesson">
        Course
      </NuxtLink>
      <button @click="logout" class="text-sm underline text-slate-500">
        Log out
      </button>
    </div>
  </div>
  <NuxtLink
    v-else
    to="/login"
    class="rounded text-white font-bold py-2 px-4 cursor-pointer bg-green-500"
  >
    Login
  </NuxtLink>
</template>

<script setup lang="ts">
const firstLesson = await useFirstLesson();
/*
 * GET THE USER
 */
const user = useSupabaseUser();
const name = computed(() => user.value?.user_metadata.full_name);
const profile = computed(() => user.value?.user_metadata.avatar_url);

/*
 * LOGOUT
 */
const { auth } = useSupabaseClient();

const logout = async () => {
  const { error } = await auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  await navigateTo('/login');
};
</script>
