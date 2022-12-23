import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../app/store';
import { Post } from '../../types/Post';

export interface PostState {
  post: Post | null;
}

const initialState: PostState = {
  post: null,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<Post | null>) => {
      // eslint-disable-next-line no-param-reassign
      state.post = action.payload;
    },
  },
});

export const { setPost } = postSlice.actions;

export const selectPost = (state: RootState) => state.post.post;

export default postSlice.reducer;
