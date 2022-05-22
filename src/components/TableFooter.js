import React, { useEffect, useState } from 'react';
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

  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(true);
  const changePage = ((direction) => {
    if (direction === -1 && page > 1) {
      setPage(page - 1); setLastPage(false);
      if (page === 1) { setFirstPage(true); }
    }
    if (direction === 1 && page < range.length) {
      setPage(page + 1);
      setFirstPage(false);
      if (page === range.length - 1) { setLastPage(true); }
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
      <ChevronLeft color={firstPage ? 'gray' : '#6BB7E8'} onClick={() => changePage(-1)} />
      <ChevronRight color={lastPage ? 'gray' : '#6BB7E8'} onClick={() => changePage(1)} />

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
