import React from 'react';
import {
  List,
  Datagrid,
  FunctionField,
  BooleanField,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  Filter,
  showNotification as showNotificationAction
} from 'admin-on-rest';

import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import PlaylistAddIcon from 'material-ui/svg-icons/av/playlist-add';
import LibraryAddIcon from 'material-ui/svg-icons/av/library-add';
import { DeleteButton } from 'admin-on-rest';
import { connect } from 'react-redux';
import moment from 'moment';
import ListButton from '../aor-components/buttons/ListButton';

import { Track } from '../api';

import Uploader from './Uploader';
// import { Grid, Row, Col } from 'react-flexbox-grid';

const cardActionStyle = {
  zIndex: 2,
  display: 'inline-block',
  float: 'right'
};

let PostActions = ({
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
      primary
      label="Scan Tracks"
      icon={<LibraryAddIcon />}
      onClick={e => {
        e.persist();
        Track.scanDir().then(res => {
          showNotification(`${res.length} new tracks`);
          refresh(e);
        }).catch((err) =>
          showNotification(`Error: ${err.message}`, 'warning')
        );
      }}
    />
  </CardActions>;

PostActions = connect(null, {
  showNotification: showNotificationAction
})(PostActions);

const TrackFilter = props =>
  <Filter {...props}>
    <TextInput source="title" alwaysOn />
  </Filter>;

export let TrackList = ({ showNotification, ...props }) =>
  <div>
    <Uploader />
    <List {...props} filters={<TrackFilter />} actions={<PostActions />}>
      <Datagrid>
        <FunctionField
          label="Time"
          render={record =>
            record.duration ?
              moment.utc(0).seconds(record.duration).format('HH:mm:ss') :
              null}
        />
        <BooleanField source="processed" label="Processed" />
        <TextField source="title" label="Track" />
        <ListButton
          buttonLabel="Add To Playlist"
          disabledField="isProccesed"
          icon={<PlaylistAddIcon />}
          onClick={record => {
            new Track(record).addToPlaylist().then(res => {
              let startTime = moment(res.startTime).format('HH:mm:ss');
              props.showNotification(`Track will be played at ${startTime}`);
            }).catch((err) =>
              showNotification(`Error: ${err.message}`, 'warning')
            );
          }}
        />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  </div>;

TrackList = connect(null, {
  showNotification: showNotificationAction
})(TrackList);

export const TrackEdit = props =>
  <Edit {...props}>
    <SimpleForm {...props}>
      <TextInput
        options={{
          fullWidth: true
        }}
        source="title"
      />
    </SimpleForm>
  </Edit>;
