import React, { findDOMNode } from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import { TableBody, TableRow } from 'material-ui/Table';
import DatagridCell from './DatagridCell';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Table } from 'material-ui/Table';

const SortableItem = SortableElement(({ children, muiTheme, style, ...rest }) => {
  const { baseTheme } = muiTheme;
  const tableStyles = {
    width: '100%',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    borderRadius: '2px',
    tableLayout: 'fixed',
    fontFamily: baseTheme.fontFamily
  };

  let styles = Object.assign(tableStyles, style);
  return (
    <TableRow style={styles} {...rest}>
      {children}
    </TableRow>
  );
});

const SortableList = SortableContainer(({ children, rest }) => {
  return (
    <TableBody displayRowCheckbox={false} className="datagrid-body" {...rest}>
      {children}
    </TableBody>
  );
});

const DatagridBody = ({
  resource,
  children,
  ids,
  data,
  basePath,
  styles,
  rowStyle,
  options,
  muiTheme,
  rowOptions,
  ref,
  ...rest
}) =>
  <SortableList
    lockToContainerEdges={true}
    onSortStart={({ node, index }) => {
      console.log(index, ids[index]);
    }}
    onSortEnd={({ oldIndex, newIndex  }) => {
      let temp = ids[oldIndex];
      ids[oldIndex] = ids[newIndex];
      ids[newIndex] = temp;
    }}
    {...rest}
    {...options}
  >
    {ids.map((id, rowIndex) => {
      return (
        <SortableItem
          muiTheme={muiTheme}
          style={rowStyle ? rowStyle(data[id], rowIndex) : styles.tr}
          key={id}
          index={rowIndex}
          selectable={false}
          {...rowOptions}
        >
          {React.Children.map(children, (field, index) =>
            <DatagridCell
              key={`${id}-${field.props.source || index}`}
              className={`column-${field.props.source}`}
              record={data[id]}
              defaultStyle={
                index === 0 ? styles.cell['td:first-child'] : styles.cell.td
              }
              {...{ field, basePath, resource }}
            />
          )}
        </SortableItem>
      );
    })}
  </SortableList>;

DatagridBody.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.any).isRequired,
  isLoading: PropTypes.bool,
  resource: PropTypes.string,
  data: PropTypes.object.isRequired,
  basePath: PropTypes.string,
  options: PropTypes.object,
  rowOptions: PropTypes.object,
  styles: PropTypes.object,
  rowStyle: PropTypes.func
};

DatagridBody.defaultProps = {
  data: {},
  ids: []
};

const PureDatagridBody = shouldUpdate(
  (props, nextProps) => nextProps.isLoading === false
)(DatagridBody);

// trick material-ui Table into thinking this is one of the child type it supports
PureDatagridBody.muiName = 'TableBody';

export default PureDatagridBody;
