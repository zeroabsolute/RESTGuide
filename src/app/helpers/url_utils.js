/**
 * Simple utility function to form a redirect url.
 * Takes care of the cases when the url already has query params.
 * 
 * @param {String} givenUrl 
 * @param {String} otherParams ("param1=value1&param2=value2")
 */

export const getRedirectUrl = (givenUrl, otherParams) => {
  const url = new URL(givenUrl);
  const existingQueryParams = Array.from(url.searchParams.keys());

  if (existingQueryParams.length) {
    return `${givenUrl}&${otherParams}`;
  }

  return `${givenUrl}${givenUrl.includes('?') ? '' : '?'}${otherParams}`;
};
