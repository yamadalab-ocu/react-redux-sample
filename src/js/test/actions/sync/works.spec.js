import test from 'ava';
import {
  START_FETCHING,
  SUCCEED_IN_FETCHING,
  FAIL_TO_FETCH,
  RESET_ERROR,
  CHANGE_FILTER,
  startFetching,
  succeedInFetching,
  failToFetch,
  resetError,
  changeFilter,
} from '../../../actions/sync/works';

test('startFetching should create START_FETCHING action', (t) => {
  t.deepEqual(
    startFetching(),
    { type: START_FETCHING },
  );
});

test('succeedInFetching should create SUCCEED_IN_FETCHING action', (t) => {
  const entities = ['post1', 'post2'];
  t.deepEqual(
    succeedInFetching(entities),
    {
      type: SUCCEED_IN_FETCHING,
      payload: {
        entities,
      },
    },
  );
});

test('failToFetch should create FAIL_TO_FETCH action', (t) => {
  const error = 'Something bad happened';
  t.deepEqual(
    failToFetch(error),
    {
      type: FAIL_TO_FETCH,
      error,
    },
  );
});

test('resetError should create RESET_ERROR action', (t) => {
  t.deepEqual(
    resetError(),
    { type: RESET_ERROR },
  );
});

test('resetError should create CHANGE_FILTER action', (t) => {
  const filter = 'SHOW_ALL';
  t.deepEqual(
    changeFilter(filter),
    {
      type: CHANGE_FILTER,
      payload: {
        filter,
      },
    },
  );
});
