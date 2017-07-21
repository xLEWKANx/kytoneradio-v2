import { fetchJson, queryParams } from '../utils/fetch';

const api = 'http://localhost:3027/api';
class musicStorage {
  constructor(model) {
    Object.assign(this, model);
  }

  static api = api;
  static baseUrl() {
    return `${this.api}${this.resource}`;
  }
  static resource = '/musicStorages';

  static fetch(url, options) {
    return fetchJson(url, options).then(
      ({ status, headers, body, json }) => json
    );
  }

  static getContainers() {
    let url = `${this.baseUrl()}/`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static createContainer(options) {
    let url = `${this.baseUrl()}/`;
    let body = options;
    return this.fetch(url, {
      method: 'POST',
      body: JSON.stringify(body)
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static destroyContainer(container) {
    let url = `${this.baseUrl()}/${container}`;
    return this.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static getContainer(container) {
    let url = `${this.baseUrl()}/${container}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static getFiles(container) {
    let url = `${this.baseUrl()}/${container}/files`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static getFile(container, file) {
    let url = `${this.baseUrl()}/${container}/files/${file}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static removeFile(container, file) {
    let url = `${this.baseUrl()}/${container}/files/${file}`;
    return this.fetch(url, {
      method: 'DELETE',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static upload() {
    let url = `${this.baseUrl()}/${this.container}/upload`;
    return this.fetch(url, {
      method: 'POST',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

  static download(container, file) {
    let url = `${this.baseUrl()}/${container}/download/${file}`;
    return this.fetch(url, {
      method: 'GET',
    }).then(res => {
      return res;
    }).catch(err => Promise.reject(err));
  }

}

export default musicStorage;
