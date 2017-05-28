import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';

import { uploadActions } from '../actions/uploadActions';
import Promise from 'bluebird';

function futch(url, opts = {}, onProgress) {
  return new Promise((res, rej) => {
    var xhr = new XMLHttpRequest();
    xhr.open(opts.method || 'get', url);
    for (var k in opts.headers || {})
      xhr.setRequestHeader(k, opts.headers[k]);
    xhr.onload = e => res(e.target.responseText);
    xhr.onerror = rej;
    if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress; // event.loaded / event.total * 100 ; //event.lengthComputable
    xhr.send(opts.body);
  });
}

class Uploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      totalFiles: 0,
      uploadedFiles: 0,
      uploading: false
    };
  }
  startUpload(files) {
    const { dispatch } = this.props;
    dispatch(uploadActions.uploadStart(files));
    this.setState({
      progress: 0,
      uploading: true,
      uploadedFiles: 0,
      totalFiles: files.length
    });

    const data = new FormData();

    const loadingStore = {};

    Promise.all(files).map(file => {
      data.append('file', file);

      return futch(
        'http://localhost:3027/api/musicStorages/music/upload',
        {
          method: 'POST',
          body: data
        },
        progressEvent => {
          loadingStore[file.name] = Math.round(
            progressEvent.loaded / progressEvent.total * 100
          );

          let fileNames = Object.keys(loadingStore);
          let fileLength = Object.keys(loadingStore).length;

          let totalProgress = fileNames.reduce((lastValue, currentFile) => {
            return lastValue + loadingStore[currentFile];
          }, 0);

          let progress = totalProgress / fileLength;

          this.setState({
            progress: progress
          });
          if (progress !== 100) {
            dispatch(uploadActions.uploadProgress(progress));
          }
        }
      ).then(res => {
        this.setState((prev) => ({
          ...prev,
          uploadedFiles: prev.uploadedFiles + 1
        }));
      });
    });
  }

  render() {
    return (
      <div>
        <Dropzone
          accept="audio/*"
          onDrop={this.startUpload.bind(this)}
          style={{
            width: '100%',
            height: 100,
            borderWidth: 2,
            borderColor: '#666',
            borderStyle: 'dashed',
            borderRadius: 5,
            boxSizing: 'border-box',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '3vw',
            color: 'lightgrey'
          }}
        >
          {this.state.uploading ?
            `Uploaded ${this.state.uploadedFiles} / ${this.state.totalFiles} tracks` :
            'Drop files here or click to add'}
        </Dropzone>
        <LinearProgress
          mode="determinate"
          style={{
            padding: '5px 0',
            backgroundColor: 'white'
          }}
          value={this.state.progress}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  uploading: state.uploading || {}
});

export default connect(mapStateToProps)(Uploader);
