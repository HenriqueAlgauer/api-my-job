interface IPagination {
  total: number;
  limit: number;
  next: number | null;
  prev: number | null;
}

export interface IApiResponse<T = unknown> {
  result: 'ok' | 'error';
  message: string;
  code: string;
  data: {
    pagination: IPagination | null;
    attributes: T;
  };
}

export function apiSuccess<T>(
  attributes: T,
  message = 'Requisição bem-sucedida',
  code = '200',
  pagination: IPagination | null = null,
): IApiResponse<T> {
  return {
    result: 'ok',
    message,
    code,
    data: {
      pagination,
      attributes,
    },
  };
}
