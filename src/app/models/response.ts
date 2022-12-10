export type Response = {
  message: String;
}

export type PaginatedResponse = Response & {
  pageSize: number;
  currentPage: number;
  lastPage: number;
}
