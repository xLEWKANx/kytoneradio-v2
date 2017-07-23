import React from 'react';
import {
  List,
  FunctionField,
  DateInput,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  DeleteButton,
  Filter,
  refresh,
  showNotification as showNotificationAction
} from 'admin-on-rest';
import Datagrid from '../aor-components/list/Datagrid';
import { connect } from 'react-redux';
import moment from 'moment';

import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import UpdateIcon from 'material-ui/svg-icons/action/update';
import ClearIcon from 'material-ui/svg-icons/content/delete-sweep';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';

import ListButton from '../aor-components/buttons/ListButton';

import { Playlist } from '../api';

const cardActionStyle = {
  zIndex: 2,
  display: 'inline-block',
  float: 'right'
};

let PlaylistActions = ({
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
            console.log(info);
            showNotification(`Deleted ${info.count} tracks from playlist`);
            refresh(e);
          })
          .catch(err => {
            showNotification(`${err.message}`, 'warning');
          });
      }}
    />
  </CardActions>;

PlaylistActions = connect(null, {
  showNotification: showNotificationAction
})(PlaylistActions);

const PlaylistFilter = props =>
  <Filter {...props}>
    <DateInput
      label="Day"
      source="startTime"
      alwaysOn
      options={{
        defaultDate: new Date(),
        minDate: new Date(),
        formatDate: value => moment(value).format('DD MMM YYYY')
      }}
    />
  </Filter>;

export let PlayList = ({ showNotification, ...props }) =>
  <div>
    <List
      {...props}
      sort={{ field: 'startTime', order: 'ASC' }}
      list={{}}
      filters={<PlaylistFilter />}
      actions={<PlaylistActions />}
    >
      <Datagrid
        onPositionChange={({ oldIndex, newIndex, item, replacedItem }) => {
          Playlist.moveTrack(item.index, replacedItem.index)
            .then(newPlaylist => {
              // return refresh();
            })
            .catch(err => {
              showNotification(`Error: ${err}`, 'warning');
            });
        }}
      >
        <TextField
          source="index"
          label="index"
          style={{
            maxWidth: 25
          }}
        />
        <TextField
          source="order"
          label="order"
          style={{
            maxWidth: 25
          }}
        />

        <FunctionField
          label="Start Time"
          render={record => moment(record.startTime).format('HH:mm:ss')}
        />
        <FunctionField
          label="End Time"
          render={record => moment(record.endTime).format('HH:mm:ss')}
        />
        <TextField source="name" label="Track" />
        <ListButton
          default
          icon={<PlayIcon />}
          onClick={(e, record) => {
            console.log('record', record, record.index);
            Playlist.play(record.index).then(track => {
              showNotification(`Playing track ${track.name}`);
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

PlayList = connect(null, {
  showNotification: showNotificationAction
})(PlayList);

export const PlayEdit = props =>
  <Edit {...props}>
    <SimpleForm {...props}>
      <TextInput
        options={{
          fullWidth: true
        }}
        source="name"
      />
    </SimpleForm>
  </Edit>;
