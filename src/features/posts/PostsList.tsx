import classNames from 'classnames';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectPosts } from './postsSlice';
import { selectPost, setPost } from '../post/postSlice';

type Props = {
  selectedPostId?: number,
};

export const PostsList: React.FC<Props> = () => {
  const posts = useAppSelector(selectPosts);
  const dispatch = useAppDispatch();
  const selectedPost = useAppSelector(selectPost);

  return (
    <div data-cy="PostsList">
      <p className="title">Posts:</p>

      <table className="table is-fullwidth is-striped is-hoverable is-narrow">
        <thead>
          <tr className="has-background-link-light">
            <th>#</th>
            <th>Title</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {posts.map(post => (
            <tr key={post.id} data-cy="Post">
              <td data-cy="PostId">{post.id}</td>
              <td data-cy="PostTitle">{post.title}</td>
              <td className="has-text-right is-vcentered">
                <button
                  type="button"
                  data-cy="PostButton"
                  className={classNames(
                    'button',
                    'is-link',
                    {
                      // eslint-disable-next-line max-len
                      'is-light': post.id !== (selectedPost ? selectedPost.id : 0),
                    },
                  )}
                  onClick={() => {
                    // eslint-disable-next-line max-len
                    dispatch(setPost(post.id === selectedPost?.id ? null : post));
                  }}
                >
                  {post.id === selectedPost?.id ? 'Close' : 'Open'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
