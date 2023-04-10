import { CourseOutline } from '~~/server/api/course/meta.get';
export default async () => {
  return await useFetchWithCache<CourseOutline>('/api/course/meta');
};
