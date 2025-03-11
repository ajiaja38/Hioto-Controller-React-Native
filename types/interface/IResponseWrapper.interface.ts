export interface IResponseMessageEntity {
  code: number;
  status: boolean;
  message: string;
}

export interface IResponseEntity<T> extends IResponseMessageEntity {
  data: T;
}
