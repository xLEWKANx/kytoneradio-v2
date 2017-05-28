import React from 'react';
import {
  List,
  Datagrid,
  FunctionField,
  ImageField,
  BooleanField,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  BooleanInput,
  SelectInput,
  LongTextInput,
  TextInput,
  NumberInput,
  NumberField,
  Filter,
  Create
} from 'admin-on-rest';
import ConditionalField from '../aor-components/fields/ConditionalField';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { ListButton, DeleteButton } from 'admin-on-rest';
import { connect } from 'react-redux';
import moment from 'moment';

import Uploader from './Uploader';
import { Grid, Row, Col } from 'react-flexbox-grid';

const TrackFilter = props => (
  <Filter {...props}>
    <TextInput source="title" alwaysOn />
  </Filter>
);

export const TrackList = props => (
  <div>
    <Uploader />
    <List {...props} filters={<TrackFilter />}>
      <Datagrid>
        <FunctionField
          label="Time"
          render={record =>
            moment.utc(0).seconds(record.duration).format('HH:mm:ss')}
        />
        <BooleanField source="processed" label="Processed" />
        <TextField source="title" label="Track" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  </div>
);

function mapStateToProps(state, props) {
  return {
    formState: state.form['record-form'] ?
      state.form['record-form'].values :
      null
  };
}

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
