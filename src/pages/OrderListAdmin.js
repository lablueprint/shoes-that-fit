import React, { useState, useEffect } from 'react';
import print from 'print-js';
import './OrderListAdmin.css';

const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

function printForm() {
  print({
    printable: 'orders',
    type: 'html',
    // ignoreElements: ['print', 'bigSubmit'],
    css: './OrderListAdmin.css',
    targetStyles: ['*'],
  });
}

function OrderListAdmin(id) {
  const [cards, setCards] = useState([]);
  const [info, setInfo] = useState([]);

  const getCards = () => {
    base('Orders')
      .select({ filterByFormula: `ID="${JSON.parse(JSON.stringify(id)).id}"` })
      .all()
      .then((records) => {
        setCards(JSON.parse(records[0].fields.Orders));
        setInfo(records[0].fields);
      });
  };

  useEffect(() => {
    getCards();
  }, []);

  return (
    info !== []
      ? (
        <div id="orders">
          <div className="head">Order Details: </div>
          <div className="wrapper">
            <div>
              <div className="title">
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
              <div className="title">
                Contact Information
              </div>
              <p>{info['Contact Name']}</p>
              <p>{info['Email Address']}</p>
              <p>
                {info.Phone}
              </p>
            </div>
          </div>
          <div className="row">
            <div className="status">
              {info && info.Active
                ? <div className="statusChildInProgress">In Progress</div>
                : <div className="statusChildFulfilled">Fulfilled</div>}
            </div>
            <div className="status">
              Order placed on
              {' '}
              {info && info.Date}
            </div>
            <div className="status">
              <button
                type="button"
                id="printform"
                name="print"
                onClick={printForm}
              >
                Print
              </button>
            </div>
          </div>
          <div className="container">
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
            <div className="space" />
            Notes
            <div className="notes">
              {info.Notes}
              {' '}
            </div>
          </div>
        </div>
      )
      : null
  );
}

export default OrderListAdmin;
