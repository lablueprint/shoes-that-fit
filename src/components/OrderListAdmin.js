import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import print from 'print-js';
import { ChevronLeft } from 'lucide-react';
// import { AdminCard } from '../components';
import styles from './OrderListAdmin.module.css';

function OrderListAdmin({ base, id, clearSpecificCard }) {
  const [cards, setCards] = useState([]);
  const [info, setInfo] = useState([]);

  function printForm() {
    print({
      printable: 'orders',
      type: 'html',
      // ignoreElements: ['print', 'bigSubmit'],
      css: './OrderListAdmin.module.css',
      targetStyles: ['*'],
    });
  }

  useEffect(() => {
    console.log(id);
    const getCards = () => {
      base('Orders')
        .select({ filterByFormula: `ID="${id}"` })
        .all()
        .then((records) => {
          console.log(records);
          setCards(JSON.parse(records[0].fields.Orders));
          setInfo(records[0].fields);
        });
    };
    getCards();
  }, []);

  return (
    info !== []
      ? (
        <div className={styles.orders} id="orders">
          <div className={styles.title}>
            <div className={styles.back}>
              <ChevronLeft size={50} type="button" onClick={clearSpecificCard} />
            </div>
            <div className={styles.head}>Order Details: </div>

          </div>
          <div className={styles.wrapper}>
            <div>
              <div className={styles.title}>
                School Information
              </div>
              <p>{info.School}</p>
              <p>{info.Address1}</p>
              <p>
                {info.City}
                {' '}
                {info.State}
              </p>
              <p>
                {info['Zip Code']}
              </p>
            </div>
            <div>
              <div className={styles.title}>
                Contact Information
              </div>
              <p>{info['Contact Name']}</p>
              <p>{info['Email Address']}</p>
              <p>
                {info.Phone}
              </p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.status}>
              {info && info.Active
                ? <div className={styles.statusChildInProgress}>In Progress</div>
                : <div className={styles.statusChildFulfilled}>Fulfilled</div>}
            </div>
            <div className={styles.status}>
              Order placed on
              {' '}
              {info && (`${new Date(Date.parse(info.Date)).toLocaleString('en', {
                month: 'long', day: 'numeric', year: 'numeric',
              })} | ${new Date(Date.parse(info.Date)).toLocaleString('en', {
                hour: 'numeric', minute: 'numeric',
              })}`)}
            </div>
            {/* <div className={styles.print}> */}
            <button
              className={styles.printButton}
              type="button"
              id="printform"
              name="print"
              onClick={printForm}
            >
              Print
            </button>
            {/* </div> */}
          </div>
          <table>
            <thead>
              <tr>
                <th width="263px">Student&apos;s First Name and Last Name</th>
                <th width="100px">Age</th>
                <th width="60px">Gender</th>
                <th width="100px">Shoe Size</th>
                <th width="70px">Wide Width?</th>
                <th width="263px">Teacher or school?</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((line) => (
                <tr>
                  <td>{line.name}</td>
                  <td>{line.age}</td>
                  <td>{line.gender}</td>
                  <td>{line.size}</td>
                  <td>{line.wideWidth ? 'Yes' : 'No'}</td>
                  <td>{line.school}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.notesTitle}>Notes</div>
          <div className={styles.notes}>
            {info.Notes}
            {' '}
          </div>
        </div>
      )
      : null
  );
}

export default OrderListAdmin;

OrderListAdmin.propTypes = {
  base: PropTypes.func.isRequired,
  id: PropTypes.string,
  clearSpecificCard: PropTypes.func,
};

OrderListAdmin.defaultProps = {
  id: '',
  clearSpecificCard: () => {},
};
