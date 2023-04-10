import { H3Event } from 'h3';

// if the user does not exist on the request, throw a 401 error
export default async (event: H3Event) => {
  if (!event.context._user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - no user',
    });
  }

  // check if user has access
  let hasAccess;
  try {
    hasAccess = await $fetch('/api/user/hasAccess', {
      headers: {
        cookie: getHeader(event, 'cookie'),
      },
    });
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not check access',
    });
  }

  if (!hasAccess) {
    console.log('--------------------------');
    console.log(event.node.req.url);
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - no access',
    });
  }
};
