export class ErrorResponse {
  error = true;

  constructor(errorMessageDetail) {
    this.errorMessage = errorMessageDetail ? 'ERROR: ' + errorMessageDetail : '';
  }
}

// function copied from https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware Jun 2022
export const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
