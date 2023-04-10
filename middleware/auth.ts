export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();
  const { data: hasAccess } = await useFetch('/api/user/hasAccess');

  if (hasAccess.value || to.params.chapterSlug === '1-chapter-1') {
    return;
  } else if (user.value && !hasAccess.value) {
    // Prevent logging in if userr has not purchased
    const client = useSupabaseClient();
    await client.auth.signOut();
  }
  return navigateTo(`/login?redirectTo=${to.path}`);
});
