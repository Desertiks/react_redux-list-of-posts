import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';

import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectPost } from '../features/post/postSlice';
import {
  fetchCommentsAsync,
  selectComments,
  selectLoaded,
  deleteCommentAsync,
} from '../features/comments/commentsSlice';
import { selectHasError } from '../features/posts/postsSlice';

export const PostDetails: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const post = useAppSelector(selectPost);
  const comments = useAppSelector(selectComments);
  const loaded = useAppSelector(selectLoaded);
  const hasError = useAppSelector(selectHasError);
  const dispatch = useAppDispatch();

  // function loadComments() {
  //   setLoaded(false);
  //   setError(false);
  //   setVisible(false);

  //   if (post) {
  //     commentsApi.getPostComments(post.id)
  //       .then(setComments) // save the loaded comments
  //       .catch(() => setError(true)) // show an error when something went wrong
  //       .finally(() => setLoaded(true)); // hide the spinner
  //   }
  // }

  // useEffect(loadComments, [post ? post.id : 0]);

  // The same useEffect with async/await

  useEffect(() => {
    dispatch(fetchCommentsAsync(post ? post.id : 0));
  }, []);

  return (
    <div className="content" data-cy="PostDetails">
      <div className="block">
        <h2 data-cy="PostTitle">
          {post && `#${post.id}: ${post.title}`}
        </h2>

        <p data-cy="PostBody">
          {post && post.body}
        </p>
      </div>

      <div className="block">
        {!loaded && (
          <Loader />
        )}

        {loaded && hasError && (
          <div className="notification is-danger" data-cy="CommentsError">
            Something went wrong
          </div>
        )}

        {loaded && !hasError && comments.length === 0 && (
          <p className="title is-4" data-cy="NoCommentsMessage">
            No comments yet
          </p>
        )}

        {loaded && !hasError && comments.length > 0 && (
          <>
            <p className="title is-4">Comments:</p>

            {comments.map(comment => (
              <article
                className="message is-small"
                key={comment.id}
                data-cy="Comment"
              >
                <div className="message-header">
                  <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                    {comment.name}
                  </a>

                  <button
                    data-cy="CommentDelete"
                    type="button"
                    className="delete is-small"
                    aria-label="delete"
                    onClick={() => dispatch(deleteCommentAsync(comment.id))}
                  >
                    delete button
                  </button>
                </div>

                <div className="message-body" data-cy="CommentBody">
                  {comment.body}
                </div>
              </article>
            ))}
          </>
        )}

        {loaded && !hasError && !visible && (
          <button
            data-cy="WriteCommentButton"
            type="button"
            className="button is-link"
            onClick={() => setVisible(true)}
          >
            Write a comment
          </button>
        )}

        {loaded && !hasError && visible && (
          <NewCommentForm />
        )}
      </div>
    </div>
  );
};
