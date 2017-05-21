import React, { Component } from 'react';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
  CircularProgress,
} from 'material-ui';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import previewImg from './img/preview.png';
import 'flexboxgrid/css/flexboxgrid.css';

const PreviewContent = ({ outerIndex, innerIndex, pictureUrl, content }) => (
  <div>
    <CardTitle
      title={`OuterIndex: ${outerIndex}`}
      subtitle={`InnerIndex: ${innerIndex}`}
    />
    <CardMedia>
      <img src={pictureUrl ? pictureUrl : previewImg} />
    </CardMedia>
    <CardText>
      <ReactMarkdown source={content ? content : ''} />
    </CardText>
  </div>
);

class PreviewComponent extends Component {
  render() {
    return (
      <Card>
        <CardHeader title="Preview" />
        {this.props.data ?
          <PreviewContent {...this.props.data} /> :
          <CircularProgress
            style={{ marginLeft: '50%', left: '-40px', marginBottom: '20px' }}
            size={80}
            thickness={5}
          />}
      </Card>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    id: props.match.params.id,
    data: state.form['record-form'] ? state.form['record-form'].values : null,
    isLoading: state.admin.loading > 0,
  };
}

export const Preview = connect(mapStateToProps)(PreviewComponent);
