import * as Params from "./params";
import * as Endpoints from "./endpoints";
import type { ResponseType, AxiosInstance } from "axios";

export { Endpoints, Params };

export interface GetConfig {
  headers?: any;
  timeout?: number;
  queryParams?: Record<string, any>;
}

export interface PostConfig {
  headers?: any;
  timeout?: number;
  queryParams?: Record<string, any>;
}
export interface PutConfig {
  headers?: any;
  timeout?: number;
  queryParams?: Record<string, any>;
}
export interface PatchConfig {
  headers?: any;
  timeout?: number;
  queryParams?: Record<string, any>;
}

export const makeApi = (axiosInstance: AxiosInstance) => {
  return {
    getApi: makeGetApi(axiosInstance),
    postApi: makePostApi(axiosInstance),
    patchApi: makePatchApi(axiosInstance),
    deleteApi: makeDeleteApi(axiosInstance),
  };
};

const makeGetApi = (axiosInstance: AxiosInstance) => {
  return async function getApi<T extends keyof Endpoints.GET>(
    url: T,
    params?: Endpoints.GET[T]["params"],
    config?: {
      headers?: any;
    }
  ): Promise<Endpoints.GET[T]["result"]> {

    try {
      const response = await axiosInstance.get(url, {
        params,
        headers: config?.headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
};

const makePostApi = (axiosInstance: AxiosInstance) => {
  return async function postApi<T extends keyof Endpoints.POST>(
    url: T,
    data: Endpoints.POST[T]["params"],
    config?: {
      headers?: any;
      timeout?: number;
      responseType?: ResponseType;
    }
  ): Promise<Endpoints.POST[T]["result"]> {
    const result = await axiosInstance.post(url, data, config);
    return result.data;
  };
};

const makePatchApi = (axiosInstance: AxiosInstance) => {
  return async function patchApi<T extends keyof Endpoints.PATCH>(
    url: T,
    data: Endpoints.PATCH[T]["params"],
    config?: {
      headers?: any;
      timeout?: number; 
    }
  ): Promise<Endpoints.PATCH[T]["result"]> {
    const result = await axiosInstance.patch(url, data, config);
    return result.data;
  };
};

const makeDeleteApi = (axiosInstance: AxiosInstance) => {
  return async function putApi<T extends keyof Endpoints.DELETE>(
    url: T,
    params?: Endpoints.DELETE[T]["params"]
  ): Promise<Endpoints.DELETE[T]["result"]> {
    const result = await axiosInstance.delete(url, {
      params,
    });
    return result.data;
  };
};