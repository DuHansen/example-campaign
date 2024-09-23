import React from 'react';

const Upgrades = () => {
  return (
    <section className="main h-100">
      <div className="container-fluid">
        <div className="row">
          <div className="col text-center py-5">
            <div className="pb-5">
              <p className="h2 fw-bold text-dark">
                <span>Wait! Exclusive Offer To Complement Your Order!</span>
              </p>
              <p className="h6">Upsell Product Example</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-11">
            <div className="row up-box bg-white">
              <div className="col-lg-6 py-4 px-0 p-lg-4">
                <div className="text-center">
                  <div className="fw-bold fs-5">
                    Flash Sale - Save 50% Off Today Only
                  </div>
                  <div className="mt-3 py-3 fw-bold fs-4 border-top border-bottom text-secondary">
                    <span className="fs-2 text-dark">Upsell Product Example</span><br />
                    simply random text
                  </div>
                  <div className="d-lg-none text-center">
                    <img src="img/up1.png" className="img-fluid" alt="Upsell Product" />
                  </div>
                  <ul className="up-list my-3">
                    <li>The standard chunk of Lorem Ipsum</li>
                    <li>Contrary to popular belief, Lorem Ipsum</li>
                    <li>Lorem Ipsum has been the industry's</li>
                    <li>Lorem Ipsum is simply dummy text</li>
                  </ul>
                  <div className="up-prcBox d-flex justify-content-center align-items-center">
                    <div className="prc-bx ret-prc p-3 border-end">
                      <div className="fs-7">Retail Price</div>
                      <span className="originalPrice fs-1 fw-bold text-muted">$60.00</span>
                    </div>
                    <div className="prc-bx ofr-prc p-3">
                      <div className="fs-7">Offer Price</div>
                      <span style={{ color: '#000' }} className="currentPrice fs-1 fw-bold">$30.00</span>
                    </div>
                  </div>
                  <div className="clearall"></div>
                  <div className="row justify-content-center">
                    <div className="col-11 col-sm-9">
                      <div className="mb-3 d-grid">
                        <button
                          type="button"
                          className="btn btn-lg btn-success py-3 px-5"
                          data-loading-text="Processing"
                          data-text="Yes! Add To My Order!"
                        >
                          Yes! Add To My Order!
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center mb-3">
                    Free Shipping In The Same Order
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-none border-start d-lg-flex justify-content-lg-center align-items-lg-center">
                <div className="text-center">
                  <img src="img/up1.png" className="img-fluid" alt="Upsell Product" />
                </div>
              </div>
            </div>
            <div className="row justify-content-center py-3">
              <div className="col py-2">
                <a href="#" className="d-flex justify-content-center align-items-center text-secondary upsell-no">
                  No thank you, I don’t want to take advantage of this one-time offer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Upgrades;
