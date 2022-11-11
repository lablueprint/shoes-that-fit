import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ChevronLeft, ChevronRight,
} from 'lucide-react';

function TableFooter({
  range, setPage, page, slice,
}) {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  // eslint-disable-next-line no-unused-vars
  const changePage = ((direction) => {
    if (direction === -1 && page > 1) {
      setPage(page - 1);
    }
    if (direction === 1 && page < range.length) {
      setPage(page + 1);
    }
  });
  return (
    <div>
      {/* {range.map((pagenum) => (

        <button
          type="button"
          key={pagenum.index}
          onClick={() => setPage(pagenum)}
        >
          {pagenum}
        </button>

      ))} */}
      <ChevronLeft color={page === 1 ? 'gray' : '#6BB7E8'} onClick={() => changePage(-1)} />
      <ChevronRight color={page === range.length ? 'gray' : '#6BB7E8'} onClick={() => changePage(1)} />

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
