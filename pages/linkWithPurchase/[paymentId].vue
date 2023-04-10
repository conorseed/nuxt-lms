<script setup>
const user = useSupabaseUser();

watchEffect(async () => {
  if (user.value) {
    const route = useRoute();
    await useFetch(`/api/user/linkWithPurchase/${route.params.paymentId}`);

    await navigateTo('/', {
      replace: true,
    });
  }
});
</script>
