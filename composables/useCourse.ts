import { CourseOutline } from '~~/server/api/course/meta.get';
export default async () => {
  const courseOutline = await useFetchWithCache<CourseOutline>(
    '/api/course/meta'
  );
  return {
    ...courseOutline.value,
    chapters: courseOutline.value.chapters.map((chapter) => {
      return {
        ...chapter,
        lessons: chapter.lessons.map((lesson) => {
          return {
            ...lesson,
            path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`,
          };
        }),
      };
    }),
  };
};
