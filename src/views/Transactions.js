import React, { Component } from 'react';
import TransactionCard from '../components/TransactionCard/TransactionCard';
import BudgetDetails from '../components/BudgetDetails/BudgetDetails';

class Transactions extends Component {
  componentDidMount() {
    const content = document.querySelector('.transactions');

    content.addEventListener('scroll', e => {
      this.debounce(() => {
        window.localStorage.setItem('pepper-scroll', e.target.scrollTop)
      }, 200)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const content = document.querySelector('.transactions');
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
    let transactionItems = [];
    let transactions = [];

    // Convert to array
    for (const item in this.props.transactions) {
      transactions.push(this.props.transactions[item]);
    }

    // Sort array then collect transactions for this budget
    transactions.sort((a,b) => Date.parse(a.date) - Date.parse(b.date)).forEach(t => {
      if (this.props.budget.id === t.budgetId) {
        transactionItems.push(<TransactionCard transaction={t} />);
      }
    });

    const style = {
      position: 'absolute',
      width: '100%',
      top: 70,
      bottom: 0,
      overflow: 'scroll',
      WebkitOverflowScrolling: 'touch'
    }

    const budgetSummary = {
      fontSize: 20,
      marginBottom: 50,
      textAlign: 'center'
    }

    const budgetInfo = {
      display: 'flex',
      alginItems: 'center',
      justifyContent: 'space-between',
      maxWidth: 600,
      margin: 'auto',
      boxSizing: 'border-box',
      padding: 20,
      fontWeight: 300
    };

    return (
      <div className="transactions" style={style}>
        <BudgetDetails budget={this.props.budget} />
        {transactionItems}
      </div>
    );
  }
}

export default Transactions;
