import type { NitroFetchRequest, $Fetch } from 'nitropack';

export class BaseRepo<T> {
  protected params: Record<string, any> = {};
  protected fetch: $Fetch<T, NitroFetchRequest>;

  constructor(fetch: $Fetch<T, NitroFetchRequest>) {
    this.fetch = fetch;
  }

  setParams(newParams: Record<string, any>) {
    this.params = { ...this.params, ...newParams };
    return this;
  }

  getQueryParams(params: Record<string, any> = this.params) {
    let query = '';
    if (Object.keys(params).length) {
      query = new URLSearchParams(params).toString();
    }
    return query;
  }
}
