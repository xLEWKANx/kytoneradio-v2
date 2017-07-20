import { fetchJson, queryParams } from '../utils/fetch';

const api = 'http://localhost:3027/api';
class Note {
  constructor(model) {
    Object.assign(this, model);
  }

  static api = api;
  static baseUrl() {
    return `${this.api}${this.resource}`;
  }
  static resource = '/Notes';

  static fetch(url, options) {
    return fetchJson(url, options).then(
      ({ status, headers, body, json }) => json
    );
  }

  static create(data) {
    let url = `${this.baseUrl()}/`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Note(res);
    }).catch(err => Promise.reject(err));
  }

  static patchOrCreate(data) {
    let url = `${this.baseUrl()}/`;
    let body = data;
    return this.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(res => {
      return new Note(res);
    }).catch(err => Promise.reject(err));
  }

  static replaceOrCreate(data) {
    let url = `${this.baseUrl()}/replaceOrCreate`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Note(res);
    }).catch(err => Promise.reject(err));
  }

  static upsertWithWhere(where, data) {
    let url = `${this.baseUrl()}/upsertWithWhere${queryParams({ where })}`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Note(res);
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
      return new Note(res);
    }).catch(err => Promise.reject(err));
  }

  static replaceById(id, data) {
    let url = `${this.baseUrl()}/${id}/replace`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new Note(res);
    }).catch(err => Promise.reject(err));
  }

  static find(filter) {
    let url = `${this.baseUrl()}/${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res.map(i => new Note(i));
    }).catch(err => Promise.reject(err));
  }

  static findOne(filter) {
    let url = `${this.baseUrl()}/findOne${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return new Note(res);
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
      return new Note(res);
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

}

export default Note;
