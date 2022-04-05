import React from 'react';
import PropTypes from 'prop-types';

function PageLengthForm({ setNumRows }) {
  return (
    <div>
      <label htmlFor="pagelength">
        Items per page
        <form className="filter" id="pagelength">

          <select name="page length options" id="page length options" onChange={(e) => setNumRows(e.target.value)}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </form>
      </label>
    </div>
  );
}
PageLengthForm.defaultProps = {
  setNumRows: ' ',
};

PageLengthForm.propTypes = {
  setNumRows: PropTypes.elementType,
};
export default PageLengthForm;
