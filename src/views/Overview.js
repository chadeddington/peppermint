import React, { Component } from 'react';
import OverallBudgetCard from '../components/OverallBudgetCard/OverallBudgetCard';
import CashFlowCard from '../components/CashFlowCard/CashFlowCard';

class Overview extends Component {
  componentWillMount() {
    this.style = {
      padding: 15
    }
  }

  render() {
    let totalBudgetAmount = 0;
    let totalSpentAmount = 0;
    // TESTING
    let totalIncome = 0;
    const budgets = this.props.budgets;

    for (const category in budgets) {
      for (const budget in budgets[category]){
        totalBudgetAmount += parseInt(budgets[category][budget].budgetAmount);
        totalSpentAmount += parseInt(budgets[category][budget].spent);
      }
    }

    const income = this.props.income;
    for (const id in income) {
      totalIncome += parseInt(income[id].amount);
    }

    const monthlyBudget = {budgetAmount: totalBudgetAmount, spent: totalSpentAmount, income: totalIncome}

    return (
      <div className="overview" style={this.style}>
        <OverallBudgetCard budget={monthlyBudget}/>
        <br />
        <CashFlowCard budget={monthlyBudget} income={totalIncome}/>
      </div>
    );
  }
}

export default Overview;
