import * as Models from "./models";

export interface GET {
  "/api/search": {
    params: {
      query: string;
      page?: number;
    };
    result: Models.SearchResponse;
  };
  "/api/users/:userId/movies": {
    params: {
      userId: string;
      favorite?: boolean;
      sort?: Models.SortKey;
      order?: Models.SortOrder;
    };
    result: Models.ListUserMoviesResponse;
  };
}

export interface POST {
  "/api/session/ensure-user": {
    params: Models.EnsureUserRequest;
    result: Models.EnsureUserResponse;
  };
  "/api/users/:userId/movies": {
    params: Models.AddMovieRequest & { userId: string };
    result: Models.AddMovieResponse;
  };
  "/api/users/:userId/movies/:id/favorite": {
    params: Models.FavoriteRequest & { userId: string; id: string };
    result: Models.FavoriteResponse;
  };
}

export interface PATCH {
  "/api/users/:userId/movies/:id": {
    params: Models.EditMovieRequest & { userId: string; id: string };
    result: Models.EditMovieResponse;
  };
}


export interface DELETE {
  "/api/users/:userId/movies/:id": {
    params: { userId: string; id: string };
    result: Models.DeleteUserMovieResponse;
  };
}