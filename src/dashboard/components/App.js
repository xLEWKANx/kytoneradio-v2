import React from 'react';
import { Admin, Resource, Delete } from 'admin-on-rest';
import loopbackRestClient, { authClient } from 'aor-loopback';

import reducers from '../reducer';
import { SlideList, SlideEdit, SlideCreate } from './Slides';
import { TrackList, TrackEdit } from './Tracks';

const App = () => (
  <Admin
    customReducers={{ reducers }}
    authClient={ authClient('http://localhost:3027/api/users') }
    restClient={loopbackRestClient('http://localhost:3027/api', undefined, {
      filterTransform: ({ title, ...rest }) => (title ? {
        title: {
          like: `${title}`,
          options: 'i'
        },
        ...rest
      } : { ...rest })
    })}
  >
    <Resource
      name="slides"
      list={SlideList}
      edit={SlideEdit}
      create={SlideCreate}
      remove={Delete}
    />
    <Resource name="tracks" list={TrackList} edit={TrackEdit} remove={Delete} />
  </Admin>
);

export default App;
