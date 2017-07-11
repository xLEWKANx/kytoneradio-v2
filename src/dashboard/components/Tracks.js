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
import { DeleteButton } from 'admin-on-rest';
import { connect } from 'react-redux';
import moment from 'moment';

import Track from '../api/Track';

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
}) => (
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
      onClick={(e) => {
        e.persist();
        Track.scanDir().then((res) => {
          showNotification(`${res.length} new tracks`);
          refresh(e);
        });
      }}
    />
  </CardActions>
);

PostActions = connect(null, {
  showNotification: showNotificationAction
})(PostActions);

const TrackFilter = props => (
  <Filter {...props}>
    <TextInput source="title" alwaysOn />
  </Filter>
);

export const TrackList = props => (
  <div>
    <Uploader />
    <List {...props} filters={<TrackFilter />} actions={<PostActions />}>
      <Datagrid>
        <FunctionField
          label="Time"
          render={record =>
            record.duration ?
            moment.utc(0).seconds(record.duration).format('HH:mm:ss') :
            null
          }
        />
        <BooleanField source="processed" label="Processed" />
        <TextField source="title" label="Track" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  </div>
);

export const TrackEdit = props => (
  <Edit {...props}>
    <SimpleForm {...props}>
      <TextInput
        options={{
          fullWidth: true
        }}
        source="title"
      />
    </SimpleForm>
  </Edit>
);
