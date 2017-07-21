import Track from './Track';
import { fetchJson, queryParams } from '../utils/fetch';

const api = 'http://localhost:3027/api';
class Playlist {
  constructor(model) {
    Object.assign(this, model);
  }

  static api = api;
  static baseUrl() {
    return `${this.api}${this.resource}`;
  }
  static resource = '/playlist';

  static fetch(url, options) {
    return fetchJson(url, options).then(
      ({ status, headers, body, json }) => json
    );
  }

  __get__track(refresh) {
    let url = `${this.constructor.baseUrl()}/${this.id}/track${queryParams({ refresh })}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return new Track(res);
    }).catch(err => Promise.reject(err));
  }

  static create(data) {
    let url = `${this.baseUrl()}/`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  static patchOrCreate(data) {
    let url = `${this.baseUrl()}/`;
    let body = data;
    return this.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  static replaceOrCreate(data) {
    let url = `${this.baseUrl()}/replaceOrCreate`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  static upsertWithWhere(where, data) {
    let url = `${this.baseUrl()}/upsertWithWhere${queryParams({ where })}`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  static exists(id) {
    let url = `${this.baseUrl()}/${id}/exists`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static findById(id, filter) {
    let url = `${this.baseUrl()}/${id}${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  static replaceById(id, data) {
    let url = `${this.baseUrl()}/${id}/replace`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  static find(filter) {
    let url = `${this.baseUrl()}/${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res.map(i => new Playlist(i));
    }).catch(err => Promise.reject(err));
  }

  static findOne(filter) {
    let url = `${this.baseUrl()}/findOne${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  static updateAll(where, data) {
    let url = `${this.baseUrl()}/update${queryParams({ where })}`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static deleteById(id) {
    let url = `${this.baseUrl()}/${id}`;
    return this.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static count(where) {
    let url = `${this.baseUrl()}/count${queryParams({ where })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  patchAttributes(data) {
    let url = `${this.constructor.baseUrl()}/${this.id}`;
    let body = data;
    return this.constructor.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  static createChangeStream(options) {
    let url = `${this.baseUrl()}/change-stream`;    let body = { options };
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static getCurrentTrack() {
    let url = `${this.baseUrl()}/getCurrentTrack`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static tracksByOrder() {
    let url = `${this.baseUrl()}/tracksByOrder`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static getSchedule() {
    let url = `${this.baseUrl()}/getSchedule`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static clear() {
    let url = `${this.baseUrl()}/clear`;
    return this.fetch(url, {
      method: 'POST',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static updatePlaylist(status) {
    let url = `${this.baseUrl()}/updatePlaylist`;    let body = { status };
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static stop() {
    let url = `${this.baseUrl()}/stop`;
    return this.fetch(url, {
      method: 'POST',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static play(index) {
    let url = `${this.baseUrl()}/play`;    let body = { index };
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

}

export default Playlist;
