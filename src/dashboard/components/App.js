import React from 'react';
import { Admin, Resource, Delete } from 'admin-on-rest';
import loopbackRestClient, { authClient } from 'aor-loopback';

import reducers from '../reducer';
import { SlideList, SlideEdit, SlideCreate } from './Slides';
import { TrackList, TrackEdit } from './Tracks';
import { PlayList, PlayEdit } from './Playlist';
import { filterTransform } from '../lib/filterTransform';

import uploadSaga from '../sideEffect/saga/uploadSaga';

const App = () =>
  <Admin
    customReducers={{ reducers }}
    customSagas={[uploadSaga]}
    authClient={authClient('http://localhost:3027/api/users/login')}
    restClient={loopbackRestClient('http://localhost:3027/api', undefined, filterTransform)}
  >
    <Resource
      name="slides"
      list={SlideList}
      edit={SlideEdit}
      create={SlideCreate}
      remove={Delete}
    />
    <Resource name="tracks" list={TrackList} edit={TrackEdit} remove={Delete} />
    <Resource name="playlist" list={PlayList} edit={PlayEdit} remove={Delete} />
  </Admin>;

export default App;
