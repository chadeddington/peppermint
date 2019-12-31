import React, { Component } from 'react';
import CashFlowCard from '../components/CashFlowCard/CashFlowCard';
import TransactionCard from '../components/TransactionCard/TransactionCard';

class CashFlow extends Component {
  componentWillMount() {

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

    const deposits = []
    const income = this.props.income;
    for (const id in income) {
      totalIncome += parseInt(income[id].amount);
      deposits.push(<TransactionCard transaction={income[id]} isIncome="true"/>)
    }

    const monthlyBudget = {budgetAmount: totalBudgetAmount, spent: totalSpentAmount, income: totalIncome}

    return (
      <div className="CashFlow" style={this.style}>
        <CashFlowCard budget={monthlyBudget} income={totalIncome}/>
        {deposits}
      </div>
    );
  }
}

export default CashFlow;
