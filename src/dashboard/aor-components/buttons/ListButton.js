import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

const ListButton = ({
  source,
  record = {},
  buttonLabel,
  onClick,
  icon,
  basePath,
  disabledField,
  ...rest
}) =>
  <FlatButton

    label={buttonLabel}
    onClick={(e) => onClick(e, record)}
    icon={icon}
    disabled={disabledField && !record[disabledField]}
    {...rest}
  />;
;

ListButton.propTypes = {
  buttonLabel: PropTypes.string,
  record: PropTypes.object,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  disabledField: PropTypes.string
};

export default ListButton;
