import React, { Component } from 'react';
import Dialog from '../Dialog/Dialog.js';
import {fire} from '../../utils/eventUtils';
import './Nav.css';

class Nav extends Component {
  constructor() {
    super();
    this.state = {
      hideDialog: true
    };
  }

  navBack = (e) => {
    if (!this.props.previousView) return;
    fire('navigate-back');
  }

  add = (e) => {
    this.setState({hideDialog: false});
  }

  dismissDialog = (e) => {
    if (e) e.stopPropagation();
    this.setState({hideDialog: true});
  }

  logOut = e => {
    fire('log-out');
  }

  render() {
    let leftNav;
    if (this.props.view !== 'Overview' && this.props.view !== 'Welcome') {
      leftNav = <div className="nav-back-arrow" onClick={this.navBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.67 1.77L9.9 0L0 9.9L9.9 19.8L11.67 18.03L3.54 9.9L11.67 1.77Z" transform="translate(0 2.10001)" fill="white"/>
                    </svg>
                    <span className="previous-view-text"> {this.props.previousView}</span>
                </div>
    } else if (this.props.view === 'Overview') {
      leftNav = <div className="log-out" onClick={this.logOut}>
                  Log out
                </div>
    }
    return (
      <div>
        <Dialog view={this.props.view}
                viewingBudget={this.props.viewingBudget}
                hideDialog={this.state.hideDialog}
                overlayClick={this.dismissDialog}
                showDelete={this.state.showDelete}
                categories={this.props.categories}/>
        <div className="nav" style={this.style}>
          <div className="nav-back nav-item" >
            {leftNav}
          </div>
          <div className="nav-view-title nav-item">
            {this.props.view}
          </div>
          <div className="nav-right nav-item">
            <div hidden={this.props.view === 'Overview' || this.props.view === "Welcome"} onClick={this.add}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.6667 10.6667H10.6667V18.6667H8V10.6667H0V8H8V0H10.6667V8H18.6667V10.6667Z" transform="translate(6.66699 6.66675)" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Nav;
