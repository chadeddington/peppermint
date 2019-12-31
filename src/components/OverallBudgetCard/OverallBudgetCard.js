import React, { Component } from 'react';
import './OverallBudgetCard.css';
import {fire} from '../../utils/eventUtils';

class OverallBudgetCard extends Component {
  constructor() {
    super();
    this.barFillRef = React.createRef();

    this.state = {left: 0};
    this.date = new Date();
    this.monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
  }

  

  calculateDayPosition() {

  }

  handleClick = (e) => {
    fire('change-view', {view: 'Budgets'})
  }

  updateBarFill() {
    const budgetAmount = this.props.budget.budgetAmount;
    const spent = this.props.budget.spent;

    // Get fill amount
    let fillPercent = spent / budgetAmount;
    if (fillPercent > 1) fillPercent = 1;
    fillPercent = fillPercent * 100;

    // Get fill color
    let fillColor = '#21CD8D';
    if (spent > budgetAmount) {
      fillColor = '#F24965';
    }

    if (this.barFillRef.current) {
      this.barFillRef.current.style.backgroundColor = fillColor;
      this.barFillRef.current.style.width = fillPercent + '%';
    }
  }

  componentDidMount() {
    // Calculate TODAY position
    const month = this.date.getMonth();
    const thirtyOneDays = [0,2,4,6,7,9,11];
    let monthLength = (thirtyOneDays.includes(month)) ? 31 : 30;

    // Don't care enough to consider leap years
    if (month === 1) monthLength = 28;
    const todayPercent = this.date.getDate() * 100 / monthLength;
    const width = document.querySelector('.budgets-card-bar-wrapper').getBoundingClientRect().width;

    
    // Trigger a re-render with this value now.
    this.setState({left: width * todayPercent *.01})

    setTimeout(_ => {
      this.updateBarFill();
    }, 100)
  }

  componentDidUpdate() {
    setTimeout(_ => {
      this.updateBarFill();
    }, 100)
  }

  render() {
    this.style = {
      left: this.state.left
    }
    
    return (
      <div className="budgets-card" onClick={this.handleClick}>
        <div className="budgets-card-month">
          { this.monthNames[this.date.getMonth()] + " Budget"}
        </div>

        <div className="budgets-card-bar-wrapper">
          <div className='budgets-card-bar-fill' ref={this.barFillRef}></div>
        </div>

        <div className="budgets-card-today" style={this.style}>
          <div className="budgets-card-today-line"></div>
          <div className="budgets-card-today-title">TODAY</div>
        </div>
      </div>
    );
  }
}

export default OverallBudgetCard;
