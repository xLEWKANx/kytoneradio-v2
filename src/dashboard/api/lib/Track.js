import Playlist from './Playlist';
import { fetchJson, queryParams } from '../utils/fetch';

const api = '/api';
class Track {
  constructor(model) {
    Object.assign(this, model);
  }

  static api = api;
  static baseUrl() {
    return `${this.api}${this.resource}`;
  }
  static resource = '/tracks';

  static fetch(url, options) {
    return fetchJson(url, options).then(
      ({ status, headers, body, json }) => json
    );
  }

  __findById__playlist(fk) {
    let url = `${this.constructor.baseUrl()}/${this.id}/playlist/${fk}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  __destroyById__playlist(fk) {
    let url = `${this.constructor.baseUrl()}/${this.id}/playlist/${fk}`;
    return this.constructor.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __updateById__playlist(fk, data) {
    let url = `${this.constructor.baseUrl()}/${this.id}/playlist/${fk}`;
    let body = data;
    return this.constructor.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  __get__playlist(filter) {
    let url = `${this.constructor.baseUrl()}/${this.id}/playlist${queryParams({ filter })}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res.map(i => new Playlist(i));
    }).catch(err => Promise.reject(err));
  }

  __create__playlist(data) {
    let url = `${this.constructor.baseUrl()}/${this.id}/playlist`;
    let body = data;
    return this.constructor.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Playlist(res);
    }).catch(err => Promise.reject(err));
  }

  __delete__playlist() {
    let url = `${this.constructor.baseUrl()}/${this.id}/playlist`;
    return this.constructor.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __count__playlist(where) {
    let url = `${this.constructor.baseUrl()}/${this.id}/playlist/count${queryParams({ where })}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static create(data) {
    let url = `${this.baseUrl()}/`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Track(res);
    }).catch(err => Promise.reject(err));
  }

  static patchOrCreate(data) {
    let url = `${this.baseUrl()}/`;
    let body = data;
    return this.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(res => {
      return new Track(res);
    }).catch(err => Promise.reject(err));
  }

  static replaceOrCreate(data) {
    let url = `${this.baseUrl()}/replaceOrCreate`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Track(res);
    }).catch(err => Promise.reject(err));
  }

  static upsertWithWhere(where, data) {
    let url = `${this.baseUrl()}/upsertWithWhere${queryParams({ where })}`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Track(res);
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
      return new Track(res);
    }).catch(err => Promise.reject(err));
  }

  static replaceById(id, data) {
    let url = `${this.baseUrl()}/${id}/replace`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Track(res);
    }).catch(err => Promise.reject(err));
  }

  static find(filter) {
    let url = `${this.baseUrl()}/${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res.map(i => new Track(i));
    }).catch(err => Promise.reject(err));
  }

  static findOne(filter) {
    let url = `${this.baseUrl()}/findOne${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return new Track(res);
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
      return new Track(res);
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

  addToPlaylist() {
    let url = `${this.constructor.baseUrl()}/${this.id}/addToPlaylist`;
    return this.constructor.fetch(url, {
      method: 'POST',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static scanDir() {
    let url = `${this.baseUrl()}/scanDir`;
    return this.fetch(url, {
      method: 'POST',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  getMeta() {
    let url = `${this.constructor.baseUrl()}/${this.id}/getMeta`;
    return this.constructor.fetch(url, {
      method: 'POST',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

}

export default Track;
