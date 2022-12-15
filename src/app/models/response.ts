/* eslint camelcase: 0*/
export type Response = {
  message: String;
};

export type PaginatedResponse = Response & {
  pageSize: number;
  currentPage: number;
  lastPage: number;
};

export type CountResponse = Response & {
  count: number;
};
