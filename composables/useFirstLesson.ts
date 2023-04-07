export default async () => {
  const course = await useCourse();
  return course.chapters[0].lessons[0];
};
