import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { TextField } from 'admin-on-rest';

/**
 * @example
 * <ConditionalField source="last_name" label="Name" render={record => `${record.first_name} ${record.last_name}`} />
 */
const ConditionalField = (props) => {
  const { record = {}, render, ...rest } = props;
  return record ?
    React.cloneElement(render(record), rest) :
    null;
};

ConditionalField.propTypes = {
  addLabel: PropTypes.bool,
  elStyle: PropTypes.object,
  label: PropTypes.string,
  render: PropTypes.func.isRequired,
  record: PropTypes.object,
  source: PropTypes.string,
};

const PureConditionalField = pure(ConditionalField);

export default PureConditionalField;
