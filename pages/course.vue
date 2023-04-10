<template>
  <div>
    <div class="mb-4 flex justify-between items-center w-full">
      <h1 class="text-3xl">
        <span class="font-medium">
          <span class="font-bold">{{ course.title }}</span>
        </span>
      </h1>
      <UserCard />
    </div>
    <div class="flex flex-row justify-center flex-grow">
      <div
        class="prose mr-4 p-8 bg-white rounded-md min-w-[20ch] max-w-[30ch] flex flex-col"
      >
        <h3 class="flex justify-between items-center">
          Chapters
          <span
            v-if="courseProgress.percentageCompleted && user"
            class="text-sm font-medium text-emerald-500"
          >
            {{ courseProgress.percentageCompleted.course }}%
          </span>
        </h3>
        <div
          v-for="(chapter, index) in course.chapters"
          :key="chapter.slug"
          class="space-y-1 mb-4 flex flex-col"
        >
          <h4 class="flex justify-between items-center">
            {{ chapter.title }}
            <span
              v-if="courseProgress.percentageCompleted && user"
              class="text-gray-400 text-sm"
            >
              {{ courseProgress.percentageCompleted.chapters[index] }}%
            </span>
          </h4>
          <NuxtLink
            v-for="(lesson, index) in chapter.lessons"
            :key="lesson.slug"
            :to="lesson.path"
            :class="{
              'text-blue-500': lesson.path === $route.fullPath,
              'text-gray-600': lesson.path !== $route.fullPath,
            }"
            class="flex flex-row space-x-1 no-underline prose-sm font-normal py-1 px-4 -mx-4"
          >
            <span class="text-gray-500">{{ index + 1 }}.</span>
            <span>{{ lesson.title }}</span>
          </NuxtLink>
        </div>
      </div>
      <div class="prose p-12 bg-white rounded-md w-[65ch]">
        <NuxtErrorBoundary>
          <NuxtPage />
          <template #error="{ error }">
            <p>Oh no, something went wrong with the lesson!</p>
            <p>
              <code>{{ error }}</code>
            </p>
            <p>
              <button
                class="hover:cursor-pointer bg-gray-500 text-white font-bold py-1 px-3 rounded"
                @click="resetError(error)"
              >
                Reset
              </button>
            </p>
          </template>
        </NuxtErrorBoundary>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCourseProgress } from '~~/stores/courseProgress';

const user = useSupabaseUser();
const course = await useCourse();
const firstLesson = await useFirstLesson();
const courseProgress = useCourseProgress();

/* ERROR HANDLING */
const resetError = async (error) => {
  await navigateTo(firstLesson.path);
  error.value = null;
};
</script>
