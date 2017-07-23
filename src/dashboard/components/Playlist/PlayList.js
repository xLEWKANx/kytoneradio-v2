import React, { Component } from 'react';
import {
  List,
  FunctionField,
  DateInput,
  TextField,
  DeleteButton,
  Filter,
  showNotification as showNotificationAction
} from 'admin-on-rest';
import Datagrid from '../../aor-components/list/Datagrid';
import { connect } from 'react-redux';
import moment from 'moment';

import PlaylistActions from './PlaylistActions';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';

import ListButton from '../../aor-components/buttons/ListButton';

import { Playlist } from '../../api';

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

class PlayListContainer extends Component {
  handlePositionChange = ({ oldIndex, newIndex, item, replacedItem }) => {
    let { showNotification } = this.props;

    Playlist.moveTrack(item.index, replacedItem.index)
      .then(newPlaylist => {
        // return refresh();
      })
      .catch(err => {
        showNotification(`Error: ${err}`, 'warning');
      });
  };

  playTrack = (e, record) => {
    let { showNotification } = this.props;

    Playlist.play(record.index)
      .then(track => {
        showNotification(`Playing track ${track.name}`);
      })
      .catch(err => showNotification(`Error: ${err.message}`, 'warning'));
  };

  render() {
    let { showNotification, ...props } = this.props;
    return (
      <div>
        <List
          {...props}
          sort={{ field: 'startTime', order: 'ASC' }}
          list={{}}
          filters={<PlaylistFilter />}
          actions={<PlaylistActions />}
        >
          <Datagrid onPositionChange={this.handlePositionChange}>
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
            <ListButton default icon={<PlayIcon />} onClick={this.playTrack} />
            <DeleteButton />
          </Datagrid>
        </List>
      </div>
    );
  }
}

export let PlayList = connect(null, {
  showNotification: showNotificationAction
})(PlayListContainer);
