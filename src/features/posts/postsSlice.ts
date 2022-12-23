/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserPosts } from '../../api/posts';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store';
import { Post } from '../../types/Post';
// eslint-disable-next-line import/no-cycle

export interface PostsState {
  posts: Post[];
  loaded: boolean;
  hasError: boolean;
}

const initialState: PostsState = {
  posts: [],
  loaded: false,
  hasError: false,
};

export const fetchPostsAsync = createAsyncThunk(
  'posts/fetchPosts',
  async (id: number) => {
    const posts = await getUserPosts(id);

    return posts;
  },
);

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setEmpty: (state) => {
      state.posts = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPostsAsync.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.hasError = false;
        state.loaded = true;
      })
      .addCase(fetchPostsAsync.pending, (state) => {
        state.loaded = false;
      })
      .addCase(fetchPostsAsync.rejected, (state) => {
        state.hasError = true;
      });
  },
});

export const { setEmpty } = postsSlice.actions;

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectHasError = (state: RootState) => state.posts.hasError;
export const selectLoaded = (state: RootState) => state.posts.loaded;

export default postsSlice.reducer;
