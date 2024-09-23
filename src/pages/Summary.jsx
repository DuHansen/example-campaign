import React from 'react';

const Summary = () => {
  return (
    <section className="main h-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col text-center py-5">
            <div className="up-top-hdng pb-5">
              <p className="up-hdng-txt1 h2 fw-bold text-dark">
                <i className="d-none d-sm-inline-block fas fa-caret-right bounce-arrow me-1"></i>
                <span>Congratulations! Your Order Is Complete!</span>
                <i className="d-none d-sm-inline-block fas fa-caret-left bounce-arrow-r ms-1"></i>
              </p>
              <p className="up-hdng-txt2 h6 text-dark">
                Your Package Will Be Shipped Within 1 - 2 Business Days.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-11">
            <div className="row up-box bg-white justify-content-center p-4 mb-4">
              <div className="col-xl-11">
                <div className="row mb-3">
                  <div className="col">
                    <div className="fs-2 fw-bold text-center">Order Receipt</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-11 order-receipt-header bg-xlight"></div>
              <div className="col-xl-11 order-receipt-items-header">
                <div className="row">
                  <div className="col py-3">
                    <div className="fs-4 fw-bold text-center">Your Order:</div>
                  </div>
                </div>
                <div className="row mb-4 border-bottom text-uppercase">
                  <div className="col-8 p-2 fs-7">
                    <div className="summary-item-title">Item</div>
                  </div>
                  <div className="col-2 p-2 fs-7 text-end">
                    <div className="summary-item-qty-title">Qty.</div>
                  </div>
                  <div className="col-2 p-2 fs-7 text-end">
                    <div className="summary-item-item-total-title">Total</div>
                  </div>
                </div>
              </div>
              <div className="col-xl-11 order-receipt-items"></div>
              <div className="col-xl-11 order-receipt-summary rounded-3 p-3 bg-xlight mt-4"></div>
              <div className="col-xl-11 order-receipt-footer"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Summary;
