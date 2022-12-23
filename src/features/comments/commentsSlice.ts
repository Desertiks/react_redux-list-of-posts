/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Comment, CommentData } from '../../types/Comment';
import { getPostComments } from '../../api/comments';
import { RootState } from '../../app/store';
import { selectPost } from '../post/postSlice';
import * as commentsApi from '../../api/comments';

export interface CommentsState {
  comments: Comment[],
  loaded: boolean,
  hasError: boolean,
}

const initialState: CommentsState = {
  comments: [],
  loaded: false,
  hasError: false,
};

export const addAsyncComment = createAsyncThunk(
  'comments/loadComments',
  async ({ name, email, body }: CommentData, { dispatch, getState }) => {
    try {
      const post = selectPost(getState() as RootState);
      const newComment = await commentsApi.createComment({
        name,
        email,
        body,
        postId: (post ? post.id : 0),
      });

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dispatch(addNewComment(newComment));
    } catch (error) {
      // console.log(error);
    }
  },
);

export const deleteCommentAsync = createAsyncThunk(
  'comments/deleteComment',
  async (id: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`https://mate.academy/students-api/comments/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Response Error');
      }

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      dispatch(deleteNewComment(id));
    } catch (error) {
      rejectWithValue(error);
    }
  },
);

export const fetchCommentsAsync = createAsyncThunk(
  'comments/fetchComments',
  async (id: number) => {
    const comments = await getPostComments(id);

    return comments;
  },
);

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addNewComment: (state, action) => {
      state.comments = [...state.comments, action.payload];
    },
    deleteNewComment: (state, action) => {
      state.comments = state.comments.filter(
        comment => comment.id !== action.payload,
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.hasError = false;
        state.loaded = true;
      })
      .addCase(fetchCommentsAsync.pending, (state) => {
        state.loaded = false;
      })
      .addCase(fetchCommentsAsync.rejected, (state) => {
        state.hasError = true;
      });
  },
});

export const { addNewComment, deleteNewComment } = commentsSlice.actions;

export const selectComments = (state: RootState) => state.comments.comments;
export const selectLoaded = (state: RootState) => state.comments.loaded;
export const selectHasError = (state: RootState) => state.comments.hasError;

export default commentsSlice.reducer;
