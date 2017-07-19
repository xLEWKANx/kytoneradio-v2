import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

const ListButton = ({
  source,
  record = {},
  buttonLabel,
  onClick,
  icon,
  disabledField
}) =>
  <FlatButton
    primary
    label={buttonLabel}
    onClick={() => onClick(record)}
    icon={icon}
    disabled={!record.processed}
  />;

ListButton.propTypes = {
  buttonLabel: PropTypes.string,
  record: PropTypes.object,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  disabledField: PropTypes.string
};

export default ListButton;
