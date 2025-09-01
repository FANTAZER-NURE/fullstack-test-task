import reducer, {
  addUserMovie,
  setFavorite,
  deleteUserMovie,
} from './userMoviesSlice';
import type { UserMoviesState } from './userMoviesSlice';
import { describe, it, expect } from 'vitest';

function baseState(): UserMoviesState {
  return {
    items: [],
    loading: false,
    error: null,
    favoriteOnly: false,
    sort: 'created_at',
    order: 'asc',
    rollbackByRequestId: {},
    deletingById: {},
  };
}

describe('userMoviesSlice', () => {
  it('optimistically inserts temp item on add pending', () => {
    const state = baseState();
    const next = reducer(state, {
      type: addUserMovie.pending.type,
      meta: {
        requestId: 'r1',
        arg: { title: 'Test', userId: 'u1', poster: 'p.jpg' },
      },
    });
    expect(next.items[0].title).toBe('Test');
    expect(next.items[0].poster).toBe('p.jpg');
    expect(next.items[0].id.startsWith('temp-')).toBe(true);
  });

  it('replaces temp item on add fulfilled', () => {
    let state = baseState();
    state = reducer(state, {
      type: addUserMovie.pending.type,
      meta: { requestId: 'r1', arg: { title: 'Test', userId: 'u1' } },
    });
    const fulfilled = reducer(state, {
      type: addUserMovie.fulfilled.type,
      meta: { requestId: 'r1' },
      payload: {
        id: 'm1',
        title: 'Test',
        year: null,
        runtime: null,
        genre: null,
        director: null,
        poster: null,
        isFavorite: false,
      },
    });
    expect(fulfilled.items[0].id).toBe('m1');
  });

  it('preserves optimistic poster when server response has no poster', () => {
    let state = baseState();
    state = reducer(state, {
      type: addUserMovie.pending.type,
      meta: {
        requestId: 'r2',
        arg: { title: 'HasPoster', userId: 'u1', poster: 'opt.jpg' },
      },
    });
    const fulfilled = reducer(state, {
      type: addUserMovie.fulfilled.type,
      meta: { requestId: 'r2' },
      payload: {
        id: 'm2',
        title: 'HasPoster',
        year: null,
        runtime: null,
        genre: null,
        director: null,
        poster: null,
        isFavorite: false,
      },
    });
    expect(fulfilled.items.find((i) => i.id === 'm2')?.poster).toBe('opt.jpg');
  });

  it('optimistically toggles favorite on pending', () => {
    const state = baseState();
    state.items = [
      {
        id: 'm1',
        title: 'A',
        year: null,
        runtime: null,
        genre: null,
        director: null,
        poster: null,
        isFavorite: false,
      },
    ];
    const next = reducer(state, {
      type: setFavorite.pending.type,
      meta: { requestId: 'r3', arg: { userId: 'u1', id: 'm1' } },
    });
    expect(next.items[0].isFavorite).toBe(true);
  });

  it('sets deleting flag on delete pending and clears on fulfilled', () => {
    let state = baseState();
    state.items = [
      {
        id: 'm1',
        title: 'A',
        year: null,
        runtime: null,
        genre: null,
        director: null,
        poster: null,
        isFavorite: false,
      },
    ];
    state = reducer(state, {
      type: deleteUserMovie.pending.type,
      meta: { requestId: 'r4', arg: { userId: 'u1', id: 'm1' } },
    });
    expect(state.deletingById['m1']).toBe(true);
    state = reducer(state, {
      type: deleteUserMovie.fulfilled.type,
      meta: { requestId: 'r4', arg: { userId: 'u1', id: 'm1' } },
      payload: { id: 'm1', deleted: true },
    });
    expect(state.deletingById['m1']).toBeUndefined();
    expect(state.items.find((i) => i.id === 'm1')).toBeUndefined();
  });
});
