/* eslint camelcase: 0*/
export type Response = {
  message: String;
};

export type PaginatedResponse<T> = Response & {
  pageSize: number;
  currentPage: number;
  lastPage: number;
  items: T[],
};

export type CountResponse = Response & {
  count: number;
};
