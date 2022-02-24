import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function TableFooter({
  range, setPage, page, slice,
}) {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <div>
      {range.map((pagenum) => (
        <button
          type="button"
          key={pagenum.index}
          onClick={() => setPage(pagenum)}
        >
          {pagenum}
        </button>
      ))}
    </div>
  );
}
TableFooter.defaultProps = {
  range: [],
  setPage: ' ',
  page: 0,
  slice: [],

};

TableFooter.propTypes = {
  range: PropTypes.node,
  setPage: PropTypes.elementType,
  page: PropTypes.number,
  slice: PropTypes.node,

};

export default TableFooter;
