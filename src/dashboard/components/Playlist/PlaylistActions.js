import React, { Component } from 'react';
import { showNotification as showNotificationAction } from 'admin-on-rest';
import { connect } from 'react-redux';

import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import UpdateIcon from 'material-ui/svg-icons/action/update';
import ClearIcon from 'material-ui/svg-icons/content/delete-sweep';

import { Playlist } from '../../api';

const cardActionStyle = {
  zIndex: 2,
  display: 'inline-block',
  float: 'right'
};

const PlaylistActions = ({
  resource,
  filters,
  displayedFilters,
  filterValues,
  basePath,
  showFilter,
  refresh,
  showNotification
}) =>
  <CardActions style={cardActionStyle}>
    {filters &&
      React.cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button'
      })}
    <FlatButton
      primary
      label="refresh"
      onClick={refresh}
      icon={<NavigationRefresh />}
    />
    <FlatButton
      secondary
      label="Update Playlist"
      icon={<UpdateIcon />}
      onClick={e => {
        e.persist();
        Playlist.updatePlaylist()
          .then(res => {
            showNotification('Playlist updated');
            refresh(e);
          })
          .catch(err => {
            showNotification(`${err.message}`, 'warning');
          });
      }}
    />
    <FlatButton
      secondary
      label="Clear Playlist"
      icon={<ClearIcon />}
      onClick={e => {
        e.persist();
        Playlist.clear()
          .then(info => {
            showNotification(`Deleted ${info.count} tracks from playlist`);
            refresh(e);
          })
          .catch(err => {
            showNotification(`${err.message}`, 'warning');
          });
      }}
    />
  </CardActions>;

export default connect(null, {
  showNotification: showNotificationAction
})(PlaylistActions);
