import { fetchJson, queryParams } from '../utils/fetch';

const api = '/api';
class user {
  constructor(model) {
    Object.assign(this, model);
  }

  static api = api;
  static baseUrl() {
    return `${this.api}${this.resource}`;
  }
  static resource = '/users';

  static fetch(url, options) {
    return fetchJson(url, options).then(
      ({ status, headers, body, json }) => json
    );
  }

  __findById__accessTokens(fk) {
    let url = `${this.constructor.baseUrl()}/${this.id}/accessTokens/${fk}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __destroyById__accessTokens(fk) {
    let url = `${this.constructor.baseUrl()}/${this.id}/accessTokens/${fk}`;
    return this.constructor.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __updateById__accessTokens(fk, data) {
    let url = `${this.constructor.baseUrl()}/${this.id}/accessTokens/${fk}`;
    let body = data;
    return this.constructor.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __findById__roles(fk) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles/${fk}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __destroyById__roles(fk) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles/${fk}`;
    return this.constructor.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __updateById__roles(fk, data) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles/${fk}`;
    let body = data;
    return this.constructor.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __link__roles(fk, data) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles/rel/${fk}`;
    let body = data;
    return this.constructor.fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __unlink__roles(fk) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles/rel/${fk}`;
    return this.constructor.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __exists__roles(fk) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles/rel/${fk}`;
    return this.constructor.fetch(url, {
      method: 'HEAD',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __get__accessTokens(filter) {
    let url = `${this.constructor.baseUrl()}/${this.id}/accessTokens${queryParams({ filter })}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __create__accessTokens(data) {
    let url = `${this.constructor.baseUrl()}/${this.id}/accessTokens`;
    let body = data;
    return this.constructor.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __delete__accessTokens() {
    let url = `${this.constructor.baseUrl()}/${this.id}/accessTokens`;
    return this.constructor.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __count__accessTokens(where) {
    let url = `${this.constructor.baseUrl()}/${this.id}/accessTokens/count${queryParams({ where })}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __get__roles(filter) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles${queryParams({ filter })}`;
    return this.constructor.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __create__roles(data) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles`;
    let body = data;
    return this.constructor.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __delete__roles() {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles`;
    return this.constructor.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  __count__roles(where) {
    let url = `${this.constructor.baseUrl()}/${this.id}/roles/count${queryParams({ where })}`;
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
      return new user(res);
    }).catch(err => Promise.reject(err));
  }

  static patchOrCreate(data) {
    let url = `${this.baseUrl()}/`;
    let body = data;
    return this.fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }).then(res => {
      return new user(res);
    }).catch(err => Promise.reject(err));
  }

  static replaceOrCreate(data) {
    let url = `${this.baseUrl()}/replaceOrCreate`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new user(res);
    }).catch(err => Promise.reject(err));
  }

  static upsertWithWhere(where, data) {
    let url = `${this.baseUrl()}/upsertWithWhere${queryParams({ where })}`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new user(res);
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
      return new user(res);
    }).catch(err => Promise.reject(err));
  }

  static replaceById(id, data) {
    let url = `${this.baseUrl()}/${id}/replace`;
    let body = data;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return new user(res);
    }).catch(err => Promise.reject(err));
  }

  static find(filter) {
    let url = `${this.baseUrl()}/${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res.map(i => new user(i));
    }).catch(err => Promise.reject(err));
  }

  static findOne(filter) {
    let url = `${this.baseUrl()}/findOne${queryParams({ filter })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return new user(res);
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
      return new user(res);
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

  static login(credentials, include) {
    let url = `${this.baseUrl()}/login${queryParams({ include })}`;
    let body = credentials;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static logout() {
    let url = `${this.baseUrl()}/logout`;
    return this.fetch(url, {
      method: 'POST',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  verify() {
    let url = `${this.constructor.baseUrl()}/${this.id}/verify`;
    return this.constructor.fetch(url, {
      method: 'POST',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static confirm(uid, token, redirect) {
    let url = `${this.baseUrl()}/confirm${queryParams({ uid, token, redirect })}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static resetPassword(options) {
    let url = `${this.baseUrl()}/reset`;
    let body = options;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static changePassword(oldPassword, newPassword) {
    let url = `${this.baseUrl()}/change-password`;    let body = { oldPassword, newPassword };
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static setPassword(newPassword) {
    let url = `${this.baseUrl()}/reset-password`;    let body = { newPassword };
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

}

export default user;
