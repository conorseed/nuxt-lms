<template>
  <div>
    <p class="mt-0 uppercase font-bold text-slate-400 mb-1">
      Lesson {{ chapter.number }} - {{ lesson.number }}
    </p>
    <h2 class="my-0">{{ lesson.title }}</h2>
    <div class="flex space-x-4 mt-2 mb-8">
      <NuxtLink
        v-if="lesson.sourceUrl"
        class="font-normal text-md text-gray-500"
        :href="lesson.sourceUrl"
      >
        Download Source Code
      </NuxtLink>
      <NuxtLink
        v-if="lesson.downloadUrl"
        class="font-normal text-md text-gray-500"
        :href="lesson.downloadUrl"
      >
        Download Video
      </NuxtLink>
    </div>
    <VideoPlayer v-if="lesson.videoId" :videoId="lesson.videoId" />
    <p>{{ lesson.text }}</p>
    <LessonCompleteButton
      v-if="user"
      :model-value="isCompleted"
      @update:model-value="courseProgress.toggleComplete"
    />
  </div>
</template>

<script setup>
import { useCourseProgress } from '@/stores/courseProgress';
/*
 * SETUP
 */
const course = await useCourse();
const route = useRoute();
const lesson = await useLesson(
  route.params.chapterSlug,
  route.params.lessonSlug
);
const user = useSupabaseUser();

definePageMeta({
  middleware: [
    async function ({ params }, from) {
      const course = await useCourse();
      const chapter = course.value.chapters.find(
        (chapter) => chapter.slug === params.chapterSlug
      );
      if (!chapter) {
        return abortNavigation(
          createError({
            statusCode: 404,
            message: 'Chapter not found',
          })
        );
      }
      const lesson = chapter.lessons.find(
        (lesson) => lesson.slug === params.lessonSlug
      );
      if (!lesson) {
        return abortNavigation(
          createError({
            statusCode: 404,
            message: 'Lesson not found',
          })
        );
      }
    },
    'auth',
  ],
});

/*
 * Create Vars
 */
const chapter = computed(() => {
  return course.value.chapters.find(
    (chapter) => chapter.slug === route.params.chapterSlug
  );
});

// const lesson = computed(() => {
//   return chapter.value.lessons.find(
//     lesson => lesson.slug === route.params.lessonSlug
//   )
// })

/*
 * Head
 */
const title = computed(() => {
  return `${lesson.value.title} - ${course.value.title}`;
});
useHead({
  title,
});

/*
 * Lesson Progress
 */
const courseProgress = useCourseProgress();
courseProgress.initialize();
// const progress = useLocalStorage('progress', []);

const isCompleted = computed(() => {
  return courseProgress.progress?.[route.params.chapterSlug]?.[
    route.params.lessonSlug
  ];
});

// const isLessonComplete = computed(() => {
//   if (!progress.value[chapter.value.number - 1]) {
//     return false;
//   }

//   if (!progress.value[chapter.value.number - 1][lesson.value.number - 1]) {
//     return false;
//   }

//   return progress.value[chapter.value.number - 1][lesson.value.number - 1];
// });

// const toggleComplete = () => {
//   if (!progress.value[chapter.value.number - 1]) {
//     progress.value[chapter.value.number - 1] = [];
//   }

//   progress.value[chapter.value.number - 1][lesson.value.number - 1] =
//     !isLessonComplete.value;
// };
</script>
