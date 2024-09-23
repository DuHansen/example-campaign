
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Body from "../layout/Body.jsx";
import Checkout from "../pages/Checkout.jsx";
import Summary from "../pages/Summary.jsx";
import Upgrades from '../pages/Upgrades.jsx';


function App() {
 

  return (
    <Router>
      <Routes>
        <Route element={<Body/>}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="summary" element={<Summary />} />
          <Route path="upgrades" element={<Upgrades />} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
