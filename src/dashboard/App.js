import React from 'react';
import { Admin, Resource, Delete } from 'admin-on-rest';
import loopbackRestClient from 'aor-loopback';

import { SlideList, SlideEdit, SlideCreate } from './Slides';

const App = () => (
  <Admin restClient={loopbackRestClient('http://localhost:3027/api')}>
    <Resource name="slides" list={SlideList} edit={SlideEdit} create={SlideCreate} remove={Delete} />
  </Admin>
);

export default App;
