export interface HttpRequest {
  url: string
  method: HttpMethod
  body?: any
  headers?: any
}

export interface HttpClient<R = any> {
  request: (data: HttpRequest) => Promise<HttpResponse<R>>
}

export type HttpMethod = 'post' | 'get' | 'put' | 'delete'

export enum HttpStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  alert = 402,
  forbidden = 403,
  notFound = 404,
  serverError = 500
}

export interface HttpResponse<T = any> {
  statusCode: HttpStatusCode
  body?: T
}
