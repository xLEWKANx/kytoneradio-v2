import React from 'react';
import {
  List,
  Datagrid,
  FunctionField,
  DateInput,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  DeleteButton,
  Filter
} from 'admin-on-rest';
import { connect } from 'react-redux';
import moment from 'moment';

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

export const PlayList = props =>
  <div>
    <List
      {...props}
      sort={{ field: 'startTime', order: 'ASC' }}
      list={{}}
      filters={<PlaylistFilter />} /* actions={<PostActions /> } */
    >
      <Datagrid>
        <FunctionField
          label="Start Time"
          render={record => moment(record.startTime).format('HH:mm:ss')}
        />
        <FunctionField
          label="End Time"
          render={record => moment(record.endTime).format('HH:mm:ss')}
        />
        <TextField source="name" label="Track" />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  </div>;

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
