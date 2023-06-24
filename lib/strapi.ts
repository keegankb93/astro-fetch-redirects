import { stringify } from "qs";
import "dotenv/config";

type TNestedObject = {
  [key: string]: string | string[] | TNestedObject;
};

type TQueryParams = {
  populate?: TNestedObject;
  filters?: TNestedObject;
  sort?: Record<string, string[]>;
  pagination?: Record<string, number>;
};

interface IFetchProps {
  endpoint: string;
  query?: TQueryParams;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Helper to create a query object to be used in strapiFetch
 * @param filter - The filter to apply to the query
 * @param populate - The nested objects to populate
 * @param pagination - The pagination to apply to the query
 * @returns Query object
 */
export function createQuery({
  filters,
  populate,
  sort,
  pagination
}: TQueryParams) {
  const query: TQueryParams = {};

  if (filters) {
    query.filters = filters;
  }

  if (populate) {
    query.populate = populate;
  }

  if (sort) {
    query.sort = sort;
  }

  if (pagination) {
    query.pagination = pagination;
  }

  return query;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function strapiFetch<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList
}: IFetchProps): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  // import.meta.env is only available in Astro
  // we need to use process.env during config init since it's ran in node
  const API_URL = process.env.STRAPI_API_URL;
  const API_TOKEN = process.env.STRAPI_TOKEN;

  const queryString = stringify(query, { encodeValuesOnly: true });
  const url = queryString
    ? new URL(`${API_URL}/api/${endpoint}?${queryString}`)
    : new URL(`${API_URL}/api/${endpoint}`);

  const res = await fetch(url.toString(), {
    headers: {
      authorization: `Bearer ${API_TOKEN}`
    }
  });

  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}
