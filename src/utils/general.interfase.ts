export enum StatusValue {
  Failed = "FAILED",
  Success = "SUCCESS"
}

export enum StatusCode {
  Ok = 200, // OK
  ResourceCreated = 201, // OK resource created successfully
  BadRequest =  400, // Bad Request: Invalid argument (invalid request payload).
  Unauthorized  = 401, // User does not have enough permissions.
  Forbidden  = 403, // Permission denied (e.g invalid API key).
  NotFound  = 404, // Resource not found.
  Conflict  = 409, // Conflict with the request (user already exist).
  ResourceExhausted = 429, // Either out of resource quota or reaching rate limiting.
  InternalErrorServer=  500, // Internal server error (retry your request).
  ServiceUnavailable = 503, // Service Unavailable: Unavailable.
  GatewayTimeout = 504 // Deadline exceeded (retry your request).
}