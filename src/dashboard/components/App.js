import React from 'react';
import { Admin, Resource, Delete } from 'admin-on-rest';
import loopbackRestClient, { authClient } from '../lib/aor-loopback';
import { SlideList, SlideEdit, SlideCreate } from './Slides';
import { TrackList, TrackEdit } from './Tracks';
import { PlayList, PlayEdit } from './Playlist';
import { filterTransform } from '../lib/filterTransform';

import reducers from '../reducer';
import uploadSaga from '../sideEffect/saga/uploadSaga';

import ImageIcon from 'material-ui/svg-icons/image/image';
import TracksIcon from 'material-ui/svg-icons/av/library-music';
import PlaylistIcon from 'material-ui/svg-icons/av/queue-music';

const App = () =>
  <Admin
    title="Kytone Radio Dashboard"
    customReducers={{ reducers }}
    customSagas={[uploadSaga]}
    authClient={authClient('http://localhost:3027/api/users/login')}
    restClient={loopbackRestClient(
      'http://localhost:3027/api',
      undefined,
      filterTransform
    )}
  >
    <Resource
      icon={ImageIcon}
      name="slides"
      list={SlideList}
      edit={SlideEdit}
      create={SlideCreate}
      remove={Delete}
    />
    <Resource
      icon={TracksIcon}
      name="tracks"
      list={TrackList}
      edit={TrackEdit}
      remove={Delete}
    />
    <Resource
      icon={PlaylistIcon}
      name="playlist"
      list={PlayList}
      edit={PlayEdit}
      remove={Delete}
    />
  </Admin>;

export default App;
