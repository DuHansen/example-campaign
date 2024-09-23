import React from 'react';

export default function Header() {
  return (
    <div>
      <div className="topbar py-3 py-lg-4">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-5 d-flex justify-content-center justify-content-md-start align-items-center pb-2 pb-md-0">
              <div className="logo">
                <img src="../src/img/logo.png" alt="Example Campaign" className="img-fluid" />
              </div>
            </div>
            <div className="col-md-7 d-flex justify-content-center justify-content-md-end align-items-center">
            <nav aria-label="breadcrumb">
                <ol
                  className="breadcrumb"
                  style={{ "--bs-breadcrumb-divider": '">"' }}
                >
                  <li className="breadcrumb-item is-current">
                    <span>CHECKOUT</span>
                  </li>
                  <li className="breadcrumb-item">UPGRADES</li>
                  <li className="breadcrumb-item">SUMMARY</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
