import { H3Event } from 'h3';

// if the user does not exist on the request, throw a 401 error
export default async (event: H3Event) => {
  if (!event.context._user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // check if user has access
  const hasAccess = await $fetch('/api/user/hasAccess');
  if (!hasAccess) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
};
