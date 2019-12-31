import React, { Component } from 'react';
import {fire} from '../../utils/eventUtils';
import './Dialog.css';

class Dialog extends Component {
  constructor() {
    super();

    this.categoryRef = React.createRef();

    this.state = {
      showDelete: false
    }
    this.dateRef = React.createRef();
  }

  stopProp = (e) => {
    e.stopPropagation();
  }

  addNewBudget = (e) => {
    e.preventDefault();
    let category = e.target.elements['category'].value.toUpperCase().trim();
    if (!category) {
      category = e.target.elements['selectCat'].value.toUpperCase().trim();
      // Reset selected
      e.target.elements['selectCat'].value = '';
      this.categoryRef.current.removeAttribute('disabled');
    }
    const title = e.target.elements['title'].value.trim();
    const budgetAmount = parseInt(e.target.elements['budgetAmount'].value);
    if (!budgetAmount) {
      alert('Amount must be a number');
      return;
    }
    const spent = 0;
    const id = new Date().getTime();

    // Send off the new budget
    const budgetDetails = {
      id,
      category,
      title,
      budgetAmount,
      spent
    }
    fire('new-budget', budgetDetails)

    // Clear form
    e.target.elements['category'].value = '';
    e.target.elements['title'].value = '';
    e.target.elements['budgetAmount'].value = '';

    // console.log(budgetDetails)
   
    this.props.overlayClick();
  }

  addNewTransaction = (e) => {
    e.preventDefault();
    const title = e.target.elements['title'].value.trim();
    // const description = e.target.elements['description'].value.trim();
    const amount = parseInt(e.target.elements['amount'].value);
    const date = e.target.elements['date'].value;

    // Validate amount
    if (!amount) {
      alert('Amount needs to be a number');
      return;
    }

    // Send off the new transaction
    const transactionDetails = {
      id: new Date().getTime(),
      budgetId: this.props.viewingBudget.id,
      budgetCategory: this.props.viewingBudget.category,
      title,
      // description,
      amount,
      date
    }

    fire('new-transaction', transactionDetails);

    // Clear form
    e.target.elements['title'].value = '';
    // e.target.elements['description'].value = '';
    e.target.elements['amount'].value = '';
    e.target.elements['date'].value = '';
   
    this.props.overlayClick();
  }

  addNewIncome = e => {
    e.preventDefault();
    const title = e.target.elements['title'].value.trim();
    const amount = parseInt(e.target.elements['amount'].value);
    const date = e.target.elements['date'].value;

    // Validate amount
    if (!amount) {
      alert('Amount needs to be a number');
      return;
    }

    // Send off the new income
    const incomeDetails = {
      id: new Date().getTime(),
      title,
      amount,
      date
    }

    fire('new-income', incomeDetails);

    // Clear form
    e.target.elements['title'].value = '';
    e.target.elements['amount'].value = '';
    e.target.elements['date'].value = '';
    
    this.props.overlayClick();
  }

  handleSelect(e) {
    if (!this.categoryRef.current) return;
    if (!e.target.value) {
      this.categoryRef.current.removeAttribute('disabled')
    } else {
      this.categoryRef.current.setAttribute('disabled', true)
    }
  }

  componentDidMount() {
    this.dateRef.current.valueAsDate = new Date();
  }

  render() {
    const categories = Object.keys(this.props.categories);
    let options = categories.map(cat => <option value={cat}>{cat}</option>);
    options.unshift(<option value=''>Create a Category</option>);
    
    return (
      <div className="overlay" hidden={this.props.hideDialog} onClick={this.props.overlayClick}>
        <div className="dialog-wrapper">

          {/* Add Budget Dialog */}
          <div className="add-budget" onClick={this.stopProp} hidden={this.props.view !== 'Budgets'}>
            <span className="add-budget-header">New Budget</span>
            <form onSubmit={this.addNewBudget}>
              <select name="selectCat" onChange={this.handleSelect.bind(this)}>
                {options}
              </select>
              <input type="text" name="category" className="add-budget-category" placeholder="Category" ref={this.categoryRef} required></input>
              <input type="text" name="title" className="add-budget-title" placeholder="Title" required></input>
              <input type="text" name="budgetAmount" className="add-budget-amount" placeholder="Amount" required></input>
              <input type="submit" className="add-budget-submit" value="Add" />
            </form>
          </div>

          {/* Add Transaction Dialog */}
          <div className="add-transaction" onClick={this.stopProp} hidden={this.props.showDelete || this.props.view === 'Budgets' || this.props.view === 'Overview' || this.props.view === 'Cash Flow'}>
            <span className="add-budget-header">Add Transaction</span>
            <form onSubmit={this.addNewTransaction}>
              <input type="text" name="title" className="add-transaction-title" placeholder="Title" required></input>
              {/* <input type="text" name="description" className="add-transaction-title" placeholder="Description"></input> */}
              <input type="text" name="amount" className="add-budget-amount" placeholder="Amount" required></input>
              <input ref={this.dateRef} type="date" name="date" className="add-transaction-date" placeholder="Date" required></input>
              <input type="submit" className="add-budget-submit" value="Add" />
            </form>
          </div>

          {/* Income Dialog */}
          <div className="add-income" onClick={this.stopProp} hidden={this.props.view !== 'Cash Flow'}>
            <span className="add-budget-header">Add Income</span>
            <form onSubmit={this.addNewIncome}>
              <input type="text" name="title" className="income-title" placeholder="Title" required></input>
              <input ref={this.dateRef} type="date" name="date" className="add-transaction-date" placeholder="Date" required></input>
              <input type="text" name="amount" className="add-budget-amount" placeholder="Amount" required></input>
              <input type="submit" className="add-budget-submit" value="Add" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Dialog;
