export const errorWrappers = {
  internalError: (code) => ({
    code,
    name: 'An internal error occured. Please, report the debug id to the customer service!',
  }),
  badRequest: (code, details) => ({
    code,
    name: 'Your request contains invalid or missing data.',
    details,
  }),
  unauthorized: (code, details) => ({
    code,
    name: 'User is not authorized to do the required operation.',
    details,
  }),
  notFound: (code, details) => ({
    code,
    name: 'The requested item was not found',
    details,
  }),
  unprocessable: (code, details) => ({
    code,
    name: 'Operation cannot be completed due to a problem.',
    details,
  }),
};

export const errorMessages = {

};