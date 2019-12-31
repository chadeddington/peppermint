import React, { Component } from 'react';
import {fire} from '../../utils/eventUtils';
import './TransactionCard.css';

class TransactionCard extends Component {
  constructor() {
    super();
    this.state = {
      showTrash: false
    }
  }

  delete = e => {
    if (!this || !this.state || !this.state.showTrash) return;
    const transaction = this.props.transaction;
    transaction.isIncome = this.props.isIncome;
    fire('delete-transaction', transaction);
  }

  handleTouchStart = (e) => {
    this.touchstartX = e.changedTouches[0].screenX;
    this.touchstartY = e.changedTouches[0].screenY;
  }

  handleTouchEnd = (e) => {
    this.touchendX = e.changedTouches[0].screenX;
    this.touchendY = e.changedTouches[0].screenY;
    this.handleGesture();
  }

  handleGesture() {
    const xDelta = Math.abs(this.touchstartX - this.touchendX);
    const yDelta = Math.abs(this.touchstartY - this.touchendY);
    // console.log("xDelta: ", xDelta)
    // console.log("yDelta: ", yDelta)

    // Check that the user wasn't just scrolling
    if (xDelta > 30 && yDelta < 30) {
      if (this.touchendX < this.touchstartX) {
        // console.log('Swiped left');
        this.setState({showTrash: true})
      }

      if (this.touchendX > this.touchstartX) {
        // console.log('Swiped right');
        this.setState({showTrash: false})
      }
    }
  }

  render() {
    // Set as if midnight in GMT
    let date = new Date(this.props.transaction.date);
    // Get timezone offset in minutes convert to milliseconds
    const offsetInMilli = date.getTimezoneOffset() * 60000;
    // Add the offset to the time and generate a new date based on that
    date.setTime(date.getTime() + offsetInMilli);
    return (
      <div className="transaction-card" onTouchStart={this.handleTouchStart}
      onTouchEnd={this.handleTouchEnd}>
        <div className="transaction-card-date">
          {new Date(date).toDateString()}
        </div>
        <div className="transaction-card-info">
          <div className="transaction-card-description">
            {this.props.transaction.title}
          </div>
          <div className="transaction-card-amount">
            <div className="transaction-card-amount-value">
              {(this.props.isIncome) ? '$' + this.props.transaction.amount : '-$' + this.props.transaction.amount}
            </div>
          </div>
        </div>
        <div className={this.state.showTrash ? 'show-trash trash-btn' : 'hide-trash trash-btn'} onClick={this.delete}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.33333 21.3333C1.33333 22.8 2.53333 24 4 24H14.6667C16.1333 24 17.3333 22.8 17.3333 21.3333V5.33333H1.33333V21.3333ZM18.6667 1.33333H14L12.6667 0H6L4.66667 1.33333H0V4H18.6667V1.33333Z" transform="translate(6.66663 4)" fill="#FFFFFF"/>
          </svg>
        </div>
      </div>
    );
  }
}

export default TransactionCard;
