import React, { Component } from 'react';
import './CashFlowCard.css';
import {fire} from '../../utils/eventUtils';

class CashFlowCard extends Component {
  constructor() {
    super();
    this.barFillRef = React.createRef();
    this.incomeBarFillRef = React.createRef();

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
    fire('change-view', {view: 'Cash Flow'})
  }

  updateBarFill() {
    const budgetAmount = this.props.income;
    const spent = this.props.budget.spent;

    // Get fill amount
    let fillPercent = spent / budgetAmount;
    if (fillPercent > 1) fillPercent = 1;
    fillPercent = fillPercent * 100;

    // Get fill color
    let fillColor = '#F24965';

    if (this.barFillRef.current) {
      this.barFillRef.current.style.backgroundColor = fillColor;
      this.barFillRef.current.style.width = fillPercent + '%';
    }

    this.updateIncomeBarFill();
  }

  updateIncomeBarFill() {
    let fillPercent = (this.props.income > 0) ? 100 : 0;

    // Get fill color
    let fillColor = '#21CD8D';

    if (this.incomeBarFillRef.current) {
      this.incomeBarFillRef.current.style.backgroundColor = fillColor;
      this.incomeBarFillRef.current.style.width = fillPercent + '%';
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
    const width = document.querySelector('.cash-flow-card-bar-wrapper').getBoundingClientRect().width;

    
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

    const difference = this.props.income - this.props.budget.spent;
    const diffStyle = {fontSize: 20};
    if (difference > 0) {
      diffStyle.color = '#21CD8D';
    } else {
      diffStyle.color = '#F24965';
    }
    
    return (
      <div className="budgets-card" onClick={this.handleClick}>
        <div className="budgets-card-month">
          Cash Flow
        </div>

        <div className="grid">
          <div className="cash-flow-card-bar-wrapper">
            <div className='cash-flow-card-bar-fill' ref={this.incomeBarFillRef}></div>
            <span className="bar-label">
              ${this.props.income}
            </span>
          </div>

          <div className="cash-flow-card-bar-wrapper">
            <div className='cash-flow-card-bar-fill' ref={this.barFillRef}></div>
            <span className="bar-label">
            - ${this.props.budget.spent}
            </span>
          </div>
          

          <div className="budgets-card-today" style={this.style}>
            <div className="budgets-card-today-line"></div>
            <div className="budgets-card-today-title">TODAY</div>
          </div>

          <div className="difference" style={diffStyle}>
            ${difference}
          </div>
        </div>

      </div>
    );
  }
}

export default CashFlowCard;
