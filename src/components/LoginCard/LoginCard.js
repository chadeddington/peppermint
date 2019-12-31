import React, { Component } from 'react';
import {fire} from '../../utils/eventUtils';
import './LoginCard.css';

class LoginCard extends Component {

  handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.elements['email'].value;
    const password = e.target.elements['password'].value;

    if (!email) {
      e.target.elements['email'].classList.add('required-field');
    } else {
      e.target.elements['email'].classList.remove('required-field');
    }
    if (!password) {
      e.target.elements['password'].classList.add('required-field');
    } else {
      e.target.elements['password'].classList.remove('required-field');
    }
    document.querySelector('.loading-screen').style.visibility = 'visible';
    fire('user-login', {email, password})

  }

  handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.elements['email'].value;
    let password;
    const password1 = e.target.elements['password1'].value;
    const password2 = e.target.elements['password2'].value;

    if (!email) {
      e.target.elements['email'].classList.add('required-field');
    } else {
      e.target.elements['email'].classList.remove('required-field');
    }
    if (!password1) {
      e.target.elements['password1'].classList.add('required-field');
    } else {
      e.target.elements['password1'].classList.remove('required-field');
    }
    if (!password2) {
      e.target.elements['password2'].classList.add('required-field');
    } else {
      e.target.elements['password2'].classList.remove('required-field');
    }

    if (password1 === password2) {
      password = password1;
    }
    document.querySelector('.loading-screen').style.visibility = 'visible';
    fire('user-register', {email, password})

  }

  render() {
    
    return (
      <div className="login-card-wrapper" >
        <div className="login-card" style={{marginBottom: 20}}>
          <h2>Log in</h2>
          <form onSubmit={this.handleLogin}>
            <input type="text" name="email" placeholder="Email"></input>
            <input type="password" name="password" placeholder="Password"></input>
            <input type="submit" value="Log In"></input>
            <span className="login-err-msg"></span>
          </form>
        </div>
        <br />
        -or-
        <br />
        <div className="login-card">
          <form onSubmit={this.handleRegister}>
            <h2>Create Account</h2>
            <input type="text" name="email" placeholder="Email"></input>
            <input type="password" name="password1" placeholder="Password"></input>
            <input type="password" name="password2" placeholder="Re-enter Password"></input>
            <input type="submit" value="Create Account"></input>
          </form>
        </div>
        
      </div>
    );
  }
}

export default LoginCard;
