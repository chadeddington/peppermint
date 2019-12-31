import React, { Component } from 'react';
import './BudgetDetails.css';
import {fire} from '../../utils/eventUtils';

class BudgetDetails extends Component {
  constructor() {
    super();
  }

  handleTitle = e => {
    const detail = {category: this.props.budget.category, id: this.props.budget.id, title: e.target.innerText}
    fire('update-budget-title', detail);
  }

  handleAmount = e => {
    const detail = {category: this.props.budget.category, id: this.props.budget.id, amount: e.target.innerText}
    fire('update-budget-amount', detail);
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  }

  render() {
    return (
      <div className="budget-details">
        <div className="budget-details-group">
          <div><small>Name</small></div>
          <div><small>Budget Amount</small></div>
        </div>
        <div className="budget-details-group budget-details-values">
          <div contentEditable="true"
               suppressContentEditableWarning={true}
               onBlur={this.handleTitle}
               onKeyPress={this.handleKeyPress}>{this.props.budget.title}</div>
          <div>$<span contentEditable="true"
                      suppressContentEditableWarning={true}
                      onBlur={this.handleAmount}
                      onKeyPress={this.handleKeyPress}>{this.props.budget.budgetAmount}</span></div>
        </div>
      </div>
    );
  }
}

export default BudgetDetails;
