import React, { Component } from 'react';
import {fire} from '../../utils/eventUtils';
import './BudgetCard.css';

class BudgetCard extends Component {
  constructor() {
    super();
    this.barFillRef = React.createRef();

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
    this.state = {
      showTrash: false,
      left: 0
    }
  }

  viewBudget = (e) => {
    // If its the overall budget card don't do anything
    if (!this.props.budget.id) return;
    fire('change-view',{ view: this.props.budget.title, budget: this.props.budget })
  }

  delete(e) {
    e.stopPropagation();
    if (!this || !this.state || !this.state.showTrash) return;
    this.setState({showTrash: false});
    fire('delete-budget', this.props.budget);
  }

  handleTouchStart = (e) => {
    if (this.props.monthBudget) return;
    this.touchstartX = e.changedTouches[0].screenX;
    this.touchstartY = e.changedTouches[0].screenY;
  }

  handleTouchEnd = (e) => {
    if (this.props.monthBudget) return;
    this.touchendX = e.changedTouches[0].screenX;
    this.touchendY = e.changedTouches[0].screenY;
    this.handleGesture();
  }

  showTrash = (e) => {
    this.setState({showTrash: true});
  }

  hideTrash = (e) => {
    this.setState({showTrash: false});
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

  updateBarFill() {
    const spent = this.props.budget.spent;
    const budgeted = this.props.budget.budgetAmount;

    let fillPercent = spent / budgeted;
    if (fillPercent > 1) fillPercent = 1;
    fillPercent = fillPercent * 100;

    let fillColor = '#21CD8D';
    if (spent > budgeted) {
      fillColor = '#F24965';
    } else if ((spent * 100 / budgeted) > 80) {
      fillColor = '#FDCF4E';
    } else if (spent == 0) {
      fillColor = '#DDDDDD';
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
    let width = 0;
    if (this.barFillRef.current) width = this.barFillRef.current.parentElement.offsetWidth;
    
    // Trigger a re-render with this value now.
    this.setState({left: width * todayPercent *.01})

    setTimeout(_ => {
      this.updateBarFill();
    }, 100)
    
  }

  componentDidUpdate() {
    setTimeout(_ => {
      this.updateBarFill();
    }, 1000)
  }

  render() {
    const spent = this.props.budget.spent;
    const budgeted = this.props.budget.budgetAmount;
    const remaining = budgeted - spent;

    const leftStyle = {left: this.state.left}
    const borderStyle = (this.props.monthBudget) ? {boxShadow: 'rgba(16, 16, 16, 0.242) 0px 3px 3px'} : {boxShadow: 'rgba(16, 16, 16, 0.242) 0px 1px 1px'}

    return (
      <div className="budget-card" onClick={this.viewBudget} onTouchStart={this.handleTouchStart}
      onTouchEnd={this.handleTouchEnd} style={borderStyle}>
        <div className="budget-card-info">
          <span style={(this.props.monthBudget) ? {fontSize: 20} : {}}>
            {this.props.budget.title}
          </span>
          <span className="budget-card-remaining">
            {`$${remaining} Left`}
          </span>
          <div className="budget-card-bar-wrapper">
            <div className="budget-card-bar-fill" ref={this.barFillRef}>
              <span className="budget-card-spent-of">{`$${spent} of $${budgeted}`}</span>
            </div>
          </div>
          {(!this.props.monthBudget) ?
            <div className={this.state.showTrash ? 'show-budget-trash budget-trash-btn' : 'hide-budget-trash budget-trash-btn'}
                 onClick={this.delete.bind(this)}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.33333 21.3333C1.33333 22.8 2.53333 24 4 24H14.6667C16.1333 24 17.3333 22.8 17.3333 21.3333V5.33333H1.33333V21.3333ZM18.6667 1.33333H14L12.6667 0H6L4.66667 1.33333H0V4H18.6667V1.33333Z" transform="translate(6.66663 4)" fill="#FFFFFF"/>
              </svg>
            </div>
          : ''}
        </div>
        
        {/* Display the today indicator */}
        <div className="budget-card-today" style={leftStyle}>
          <div className="budget-card-today-line"></div>
        {(this.props.monthBudget) ? <div className="budgets-card-today-title">TODAY</div> : '' }
        </div>
      </div>
    );
  }
}

export default BudgetCard;
