import React, { Component } from 'react';
import BudgetCard from '../components/BudgetCard/BudgetCard';

class Budgets extends Component {
  componentDidMount() {
    const content = document.querySelector('.budgets-wrapper');

    content.addEventListener('scroll', e => {
      this.debounce(() => {
        window.localStorage.setItem('pepper-scroll', e.target.scrollTop)
      }, 200)
    })
  }

  componentDidUpdate() {
    const content = document.querySelector('.budgets-wrapper');
    content.scrollTop = window.localStorage.getItem('pepper-scroll') || 0;
  }

  debounce(func, wait) {
    var timeout;
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  render() {
    let budgets = [];
    const labelStyle = {
      textAlign: 'center',
      color: '#676767',
      padding: 6
    }
    const scrollWrapper = {
      position: 'absolute',
      left: 0,
      width: '100%',
      top: 180,
      bottom: 0,
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch'
    }

    const budgetsStyle ={maxWidth: 600, margin: 'auto'};

    const scrollDiv = {maxWidth: 600, margin: 'auto', overflowX: 'hidden', overflowY: 'scroll', WebkitOverflowScrolling: 'touch'}

    let totalBudgetAmount = 0;
    let totalSpentAmount = 0;

    for (const category in this.props.budgets) {
      budgets.push(
        <div style={labelStyle}>{category}</div>
      )
      const category = this.props.budgets[category];
      for (const id in category) {
        const item = category[id];
        totalBudgetAmount += parseInt(item.budgetAmount);
        totalSpentAmount += parseInt(item.spent);
        budgets.push(
          <BudgetCard budget={item} />
        )
      }
    }

     const date = new Date();
     const monthNames = [
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

    const monthName = monthNames[date.getMonth()];
    const title = monthName + ' ' + date.getFullYear();

    return (

      <div className="budgets" style={budgetsStyle}>
        {/* Display the month budget card */}
        <BudgetCard budget={{title: title, budgetAmount: totalBudgetAmount, spent: totalSpentAmount}} monthBudget="true" />
        <div className="budgets-wrapper" style={scrollWrapper}>
          {/* Iterate over and display the individual category budgets */}
          <div style={scrollDiv}>
            {budgets}
          </div>
        </div>

      </div>
    );
  }
}

export default Budgets;
