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
import ConditionalField from './aor-components/fields/ConditionalField';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { ListButton, DeleteButton } from 'admin-on-rest';
import { connect } from 'react-redux';

import { Grid, Row, Col } from 'react-flexbox-grid';

import { Preview } from './Preview';

const PostFilter = props => (
  <Filter {...props}>
    <NumberInput source="outerIndex" alwaysOn />
    <NumberInput source="innerIndex" />
  </Filter>
);

export const SlideList = props => (
  <List {...props} filters={<PostFilter />}>
    <Datagrid>
      <BooleanField source="local" label="is post?" />
      <NumberField source="outerIndex" label="row" />
      <NumberField source="innerIndex" label="number" />
      <ImageField source="pictureUrl" />
      <ConditionalField
        label="content"
        render={record =>
          (record.local ?
            <TextField source="content" /> :
            <TextField source="outerUrl" />)}
      />
      <EditButton />
    </Datagrid>
  </List>
);

const SlideTitle = ({ record }) => {
  return (
    <span>
      Slide
      {' '}
      {record ? `edit "${record.outerIndex} - ${record.innerIndex}"` : 'create'}
    </span>
  );
};

const SlideEditActions = ({ basePath, data, refresh }) => (
  <CardActions>
    <ListButton basePath={basePath} />
    <DeleteButton
      basePath={basePath}
      actions={<SlideEditActions />}
      record={data}
    />
    <FlatButton
      primary
      label="Reset"
      onClick={refresh}
      icon={<NavigationRefresh />}
    />
  </CardActions>
);

function mapStateToProps(state, props) {
  return {
    formState: state.form['record-form'] ?
      state.form['record-form'].values :
      null
  };
}

const SlideContent = connect(mapStateToProps)(props => {
  return (
    <SimpleForm {...props}>
      <SelectInput
        source="outerIndex"
        choices={[
          { id: 0, name: 'First row' },
          { id: 1, name: 'Second row' },
          { id: 2, name: 'Third row' }
        ]}
      />
      <NumberInput source="innerIndex" />
      <TextInput source="pictureUrl" />
      <BooleanInput label="Post?" source="local" />
      {props.formState && props.formState.local ?
        <LongTextInput source="content" /> :
        <TextInput source="outerUrl" />}
    </SimpleForm>
  );
});

export const SlideEdit = props => (
  <Grid fluid>
    <Row>
      <Col xs={12} md={6}>
        <Edit title={<SlideTitle />} actions={<SlideEditActions />} {...props}>
          <SlideContent {...props} />
        </Edit>
      </Col>
      <Col xs={12} md={6}>
        <Preview {...props} />
      </Col>
    </Row>
  </Grid>
);

export const SlideCreate = props => (
  <Grid fluid>
    <Row>
      <Col xs={12} md={6}>
        <Create {...props}>
          <SlideContent {...props} />
        </Create>
      </Col>
      <Col xs={12} md={6}>
        <Preview {...props} />
      </Col>
    </Row>
  </Grid>
);
