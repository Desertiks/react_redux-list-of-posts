import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchUsersAsync,
  selectStatus, selectUsers,
} from './usersSlice';
import { selectAuthor, setAuthor } from '../author/authorSlice';

export const UserSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const author = useAppSelector(selectAuthor);
  const usersStatus = useAppSelector(selectStatus);
  const [expanded, setExpanded] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUsersAsync());
  }, []);

  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [document.activeElement]);

  return (
    <div
      data-cy="UserSelector"
      className={classNames('dropdown', { 'is-active': !!expanded })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          ref={inputRef}
          onClick={() => {
            setExpanded(current => !current);
          }}
        >
          <span>
            {author?.name || 'Choose a user'}
          </span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {usersStatus === 'loading' && <h2>Loading...</h2>}
          {users.map(user => (
            <a
              key={user.id}
              href={`#user-${user.id}`}
              onClick={() => {
                dispatch(setAuthor(user));
              }}
              className={classNames('dropdown-item', {
                'is-active': user.id === author?.id,
              })}
            >
              {user.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};