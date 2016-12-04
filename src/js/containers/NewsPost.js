import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import findIndex from 'lodash/array/findIndex';

import load from '../actions/async/news';
import { resetError } from '../actions/sync/news';
import PageNavigator from '../components/PageNavigator';
import PostNavigator from '../components/PostNavigator';
import Post from '../components/Post';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

class NewsPost extends Component {
  componentDidMount() {
    const { entities, error } = this.props;
    if (error !== null) {
      this.props.resetError();
    }
    if (entities.length === 0) {
      this.props.load();
    }
  }

  renderPostNavigator() {
    const { entities, routeParams: { id } } = this.props;
    // todo: should sort in other place
    const sortedEntities = entities.sort((a, b) => {
      if (a.timestamp > b.timestamp) {
        return -1;
      } else if (a.timestamp < b.timestamp) {
        return 1;
      }
      return 0;
    });
    const index = findIndex(sortedEntities, entity => entity.id === parseInt(id, 10));
    if (index !== -1) {
      const prevEntity = sortedEntities[index - 1];
      const nextEntity = sortedEntities[index + 1];
      const prevPath = prevEntity ? `/news/${prevEntity.id}` : null;
      const nextPath = nextEntity ? `/news/${nextEntity.id}` : null;

      return (
        <PostNavigator
          prevPath={prevPath}
          nextPath={nextPath}
        />
      );
    }
    return null;
  }

  renderMainSection() {
    const { isFetching, error, entities, routeParams: { id } } = this.props;
    if (isFetching) {
      return (
        <Loading />
      );
    } else if (error) {
      return (
        <ErrorMessage
          message={error}
        />
      );
    }

    const selectedPost = entities.find(entity => entity.id === parseInt(id, 10));
    if (typeof selectedPost === 'undefined') {
      return (
        <ErrorMessage
          message="No work found."
        />
      );
    }

    return (
      <Post
        title={selectedPost.title}
        body={selectedPost.body}
        timestamp={selectedPost.timestamp}
      />
    );
  }

  render() {
    const { isFetching, entities } = this.props;
    const isEmpty = entities.length === 0;
    return (
      <div className="app">
        <PageNavigator />
        {!isFetching && isEmpty ? this.renderPostNavigator() : null}
        {this.renderPostNavigator()}
        <div className="content">
          {this.renderMainSection()}
        </div>
      </div>
    );
  }
}

NewsPost.propTypes = {
  entities: PropTypes.arrayOf(PropTypes.shape({
    body: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  error: PropTypes.string,
  isFetching: PropTypes.bool.isRequired,
  load: PropTypes.func.isRequired,
  resetError: PropTypes.func.isRequired,
  routeParams: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    entities: state.news.entities,
    isFetching: state.news.isFetching,
    error: state.news.error,
  };
}

export default connect(mapStateToProps, {
  load,
  resetError,
})(NewsPost);