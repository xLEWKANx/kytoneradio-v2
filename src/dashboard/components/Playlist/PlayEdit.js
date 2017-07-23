import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
} from 'admin-on-rest';

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
