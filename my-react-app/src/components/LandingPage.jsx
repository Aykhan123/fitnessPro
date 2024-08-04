import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // For Bootstrap CSS if needed

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div>
      <div className="bg-blue-500">
        <nav className="navbar navbar-dark navbar-expand-md navigation-clean-search">
          <div className="container mx-auto">
            <a className="navbar-brand" href="#">Company Name</a>
            <button 
              className="navbar-toggler" 
              onClick={toggleNav} 
              aria-controls="navcol-1" 
              aria-expanded={isNavOpen} 
              aria-label="Toggle navigation">
              <span className="sr-only">Toggle navigation</span>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navcol-1">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" href="#">Link</a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                    Dropdown
                  </a>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a className="dropdown-item" href="#">First Item</a>
                    <a className="dropdown-item" href="#">Second Item</a>
                    <a className="dropdown-item" href="#">Third Item</a>
                  </div>
                </li>
              </ul>
              <form className="form-inline mr-auto">
                <div className="form-group">
                  <label htmlFor="search-field">
                    <i className="fa fa-search"></i>
                  </label>
                  <input className="form-control search-field" type="search" id="search-field" />
                </div>
              </form>
              <span className="navbar-text">
                <a href="#" className="login">Log In</a>
              </span>
              <a className="btn btn-light action-button" href="#">Sign Up</a>
            </div>
          </div>
        </nav>
        <div className="container hero mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full lg:w-6/12 xl:w-5/12 xl:ml-auto">
              <h1>The revolution is here.</h1>
              <p>Mauris egestas tellus non ex condimentum, ac ullamcorper sapien dictum. Nam consequat neque quis sapien viverra convallis. In non tempus lorem.</p>
              <button className="btn btn-light btn-lg action-button">Learn More</button>
            </div>
            <div className="hidden lg:block lg:w-5/12 xl:w-5/12 xl:ml-auto">
              <div className="iphone-mockup">
                <img src="assets/img/iphone.svg" className="device" alt="iPhone Mockup" />
                <div className="screen"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;