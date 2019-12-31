import React, { Component } from 'react';
import {listen} from './utils/eventUtils';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import Nav from './components/Nav/Nav';
// Views
import Login from './views/Login';
import Overview from './views/Overview';
import Budgets from './views/Budgets';
import Transactions from './views/Transactions';
import CashFlow from './views/CashFlow';

class App extends Component {
  constructor() {
    super();
    let database;
    let config = {
      apiKey: "AIzaSyB_C-FwLU98mRdtZdjD-McOQnxbmthI0Rw",
      authDomain: "react-budget-b38c7.firebaseapp.com",
      databaseURL: "https://react-budget-b38c7.firebaseio.com",
      projectId: "react-budget-b38c7",
      storageBucket: "react-budget-b38c7.appspot.com",
      messagingSenderId: "756798029372"
    }
    firebase.initializeApp(config)

    this.state = {
      loggedIn: false,
      view: 'Overview',
      previousView: '',
      budgets: {},
      transactions: {}
    }

    // Sample structure
    // this.state = {
    //   loggedIn: false,
    //   view: 'Welcome',
    //   previousView: '',
    //   income: {
    //     1: {
    //        id: 1,
    //        title: 'First paycheck',
    //        amount: 2000,
    //        date: 2018-07-01
    //      }
    //   }
    //   budgets: {
    //     HOME: {
    //       1: {
    //         id: 1,
    //         title: 'Mortgage',
    //         category: 'Home',
    //         budgetAmount: 1200,
    //         spent: 600
    //       }
    //     },
    //     UTILITIES: {
    //       2: {
    //         id: 2,
    //         title: 'City',
    //         category: 'Utilities',
    //         budgetAmount: '300',
    //         spent: 200
    //       },
    //       3: {
    //         id: 3,
    //         title: 'Gas',
    //         category: 'Utilities',
    //         budgetAmount: '100',
    //         spent: 40
    //       },
    //       4: {
    //         id: 4,
    //         title: 'Electric',
    //         category: 'Utilities',
    //         budgetAmount: '150',
    //         spent: 120
    //       }
    //     }

    //   },
    //   transactions: {
    //     a: {
    //       budgetId: 1,
    //       id: 'a',
    //       title: "Deposit",
    //       description: 'Pay mortgage',
    //       amount: 600,
    //       date: '2018-07-25T15:27:03.619Z'
    //     },
    //     b: {
    //       budgetId: 2,
    //       id:'b',
    //       title: "Eagle Mountain",
    //       description: 'Online bill pay',
    //       amount: 200,
    //       date: '2018-07-25T15:27:03.619Z'
    //     }
    //   }
    // }
  }

  componentDidMount() {
    //  FOR TESTING
    window.app = this;

    let loadingSpinner = this.loadingSpinner;
    loadingSpinner.style.visibility = 'visible';

    // Event Listeners
    listen('change-view',(e) => {
      this.changeView(e.detail.view, e.detail.budget);
    });

    listen('navigate-back',(e) => {
      this.changeView(this.state.previousView);
    });

    listen('log-out', e => {
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log('Log out successfull');
        window.localStorage.removeItem('pepper-view');
        window.localStorage.removeItem('pepper-previousView');
        window.localStorage.removeItem('pepper-budgetToView');
        this.setState({loggedIn: false, view: 'Welcome'})
      }).catch(function(error) {
        // An error happened.
        console.log(error);
      });
    });

    /******************************
     * BUDGET ACTIONS
     * *****************************/
    listen('new-budget', (e) => {
      // Capitalize the first char of every word in the category
      const category = e.detail.category;
      const budgets = this.state.budgets;
      const id = e.detail.id;
      budgets[category] = {};
      budgets[category][id] = e.detail;
      const userId = this.state.loggedIn.uid;
      if (!userId) return;
      const today = new Date();
      const budgetNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/budgets/${category}/${id}`;
      firebase.database().ref(budgetNode).set(e.detail).catch(err => {
        console.error(err);
      })
    });

    listen('delete-budget', e => {
      const today = new Date();
      const budget = e.detail;
      const userId = this.state.loggedIn.uid;
      let basePath = `users/${userId}/${today.getFullYear()}/${today.getMonth()}`

      // Delete the associated transactions
      const transactions = this.state.transactions;
      for (const id in transactions) {
        if (transactions[id].budgetId === budget.id) {
          const transactionNode = basePath + '/transactions/' + id;
          firebase.database().ref(transactionNode).remove().catch(err => {
            console.error(err);
          })
        }
      };

      // Delete the budget
      const budgetNode = basePath + '/budgets/' + budget.category + '/' + budget.id;

      // If there was only one more Category and only one more budget, then clear locally
      // since the value change handler won't fire on the node that no longer exists
      if (Object.keys(this.state.budgets).length == 1) {
        if (Object.keys(this.state.budgets[budget.category]).length == 1) {
          const current = this.state.budgets;
          current.budgets = {};
          this.setState(current);
        }
      }

      firebase.database().ref(budgetNode).remove().catch(err => {
        console.error(err);
      })

    })

    listen('update-budget-title', e => {
      const category = e.detail.category;
      const budgets = this.state.budgets;
      const id = e.detail.id;
      let thisBudget = budgets[category][id]
      thisBudget.title = e.detail.title;
      this.setState({view: e.detail.title});
      const userId = this.state.loggedIn.uid;
      if (!userId) return;
      const today = new Date();
      const budgetNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/budgets/${category}/${id}`;
      firebase.database().ref(budgetNode).set(thisBudget).catch(err => {
        console.error(err);
      })
    })

    listen('update-budget-amount', e => {
      const category = e.detail.category;
      const budgets = this.state.budgets;
      const id = e.detail.id;
      let thisBudget = budgets[category][id]
      thisBudget.budgetAmount = e.detail.amount;
      const userId = this.state.loggedIn.uid;
      if (!userId) return;
      const today = new Date();
      const budgetNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/budgets/${category}/${id}`;
      
      firebase.database().ref(budgetNode).set(thisBudget).catch(err => {
        console.error(err);
      })
    })

    /*********************************
     * TRANSACTION ACTIONS
     *********************************/
    listen('new-transaction', (e) => {
      // Update spent amount
      // let budgets = this.state.budgets;
      let updateBudget = this.state.budgets[e.detail.budgetCategory][e.detail.budgetId]
      updateBudget.spent += parseInt(e.detail.amount);
      const id = e.detail.id
      const userId = this.state.loggedIn.uid;
      if (!userId) return;
      const today = new Date();
      const transactionNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/transactions/${id}`

      firebase.database().ref(transactionNode).set(e.detail).catch(err => {
        console.error(err);
      })

      const budgetNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/budgets/${e.detail.budgetCategory}/${e.detail.budgetId}`;
      firebase.database().ref(budgetNode).set(updateBudget).catch(err => {
        console.error(err);
      })
    })

    listen('new-income', e => {
      const id = e.detail.id
      const userId = this.state.loggedIn.uid;
      if (!userId) return;
      const today = new Date();
      const incomeNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/income/${id}`

      firebase.database().ref(incomeNode).set(e.detail).catch(err => {
        console.error(err);
      })
    })

    listen('delete-transaction', e => {
      const id = e.detail.id;
      const userId = this.state.loggedIn.uid;
      if (!userId) return;

      const today = new Date();

      if (!e.detail.isIncome) {
        let updateBudget = this.state.budgets[e.detail.budgetCategory][e.detail.budgetId]
        updateBudget.spent -= parseInt(e.detail.amount);
        const transactionNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/transactions/${id}`
        // Remove the transaction
        firebase.database().ref(transactionNode).remove().catch(err => {
          console.error(err);
        });
        // Update the budget
        const budgetNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/budgets/${e.detail.budgetCategory}/${e.detail.budgetId}`;
        firebase.database().ref(budgetNode).set(updateBudget).catch(err => {
          console.error(err);
        });
      } else {
        const incomeNode = `users/${userId}/${today.getFullYear()}/${today.getMonth()}/income/${id}`
        // Remove the income node
        firebase.database().ref(incomeNode).remove().catch(err => {
          console.error(err);
        });
      }
    })

    /*******************************
     * AUTH ACTIONS
     ******************************/
    listen('user-login', e => {
      firebase.auth().signInWithEmailAndPassword(e.detail.email, e.detail.password).then(e => {
        console.log('Success', e);
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(error.message);
      });
    })

    listen('user-register', (e) => {
      firebase.auth().createUserWithEmailAndPassword(e.detail.email, e.detail.password).then(success => {
        firebase.database().ref('users/' + success.user.uid).set({
          email: success.user.email
        });
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(error.message);
      });
    });

    firebase.auth().onAuthStateChanged(((user) => {
      if (user) {
        // User is signed in.
        console.log('Successfull login!')

        // Check for last viewed page
        const view = window.localStorage.getItem('pepper-view') || 'Overview';
        const previousView = window.localStorage.getItem('pepper-previousView') || '';
        let budgetToView = window.localStorage.getItem('pepper-budgetToView');
        if (budgetToView) budgetToView = JSON.parse(budgetToView);
        this.setState({loggedIn: user, view: view, previousView: previousView, viewingBudget: budgetToView})

        // Listen for data changes
        const today = new Date();
        const monthNode = `users/${user.uid}/${today.getFullYear()}/${today.getMonth()}`;
        firebase.database().ref(monthNode).on('value', snapshot => {
          const data = snapshot.val();
          if (!data) {
            // get last month's budget
            this.fetchPreviousBudgets(user)
            return;
          } else {
            this.loadingSpinner.style.visibility = 'hidden';
            this.setState({ budgets: data.budgets, transactions: data.transactions || {} , income: data.income || {} });
          }
        })
      } else {
        // No user is signed in.
        this.setState({loggedIn: false, view: 'Welcome'})
        this.loadingSpinner.style.visibility = 'hidden';
      }
    }).bind(this));
  }

  // TO DO: 
  //  Refactor to use this function to get data on any month
  getMonthData(month, year) {
    // Create node
    const monthNode = `users/${user.uid}/${year}/${month}`;
    const user = this.state.loggedIn;

    this.loadingSpinner.style.visibility = 'visible';

    // Check in-memory cache


    // Query Database
    firebase.database().ref(monthNode).once('value', snapshot => {
      const data = snapshot.val();
      if (!data) {
        // No data for this month
        return;
      } else {
        this.loadingSpinner.style.visibility = 'hidden';
        this.setState({ budgets: data.budgets, transactions: data.transactions || {} , income: data.income || {} });
      }
    })
  }

  get loadingSpinner() {
    return document.querySelector('.loading-screen');
  }

  fetchPreviousBudgets(user) {
    const today = new Date();
    let month = today.getMonth();
    if (month == 0) {
      month = 11;
    } else {
      month--;
    }
    const lastMonthNode = `users/${user.uid}/${today.getFullYear()}/${month}/budgets`;
    const monthNode = `users/${user.uid}/${today.getFullYear()}/${today.getMonth()}/budgets`;
    firebase.database().ref(lastMonthNode).once('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        // Loop through and reset the spent amount
        const categories = Object.keys(data);
        categories.forEach(cat => {
          for (const id in data[cat]) {
            data[cat][id].spent = 0;
          }
        })
        
        // Update current month with reset budgets
        firebase.database().ref(monthNode).set(data).catch(err => {
          console.error(err);
        });

        this.setState({ budgets: data });
      }
      // Hide loading spinner
      this.loadingSpinner.style.visibility = 'hidden';
    })
  }

  changeView(view, budget) {
    let previousView = this.state.previousView;
    switch (view) {
      case 'Overview':
        previousView = '';
        break;
      case 'Cash Flow':
        previousView = 'Overview';
        break;
      case 'Budgets':
        previousView = 'Overview';
        break;
      default:
        previousView = 'Budgets'
        break;
    }
    if (budget) {
      this.setState({view: view, previousView: previousView, viewingBudget: budget});
    } else {
      this.setState({view: view, previousView: previousView});
    }
    
    window.localStorage.setItem('pepper-view', view);
    window.localStorage.setItem('pepper-previousView', previousView);
    if (budget) {
      window.localStorage.setItem('pepper-budgetToView', JSON.stringify(budget));
    } else {
      window.localStorage.removeItem('pepper-budgetToView');
    }
  }

  render() {
    // Calc monthly budget stats
    const monthlyBudget = {
      spent: 3500,
      budgetAmount: 5000
    }

    // Simplistic Router
    let viewToRender;
    if (this.state.loggedIn) {
      if (this.state.view === 'Overview') {
        viewToRender = <Overview budgets={this.state.budgets} income={this.state.income}/>;
      } else if (this.state.view === 'Cash Flow') {
        viewToRender = <CashFlow budgets={this.state.budgets} income={this.state.income}/>
      } else if (this.state.view === 'Budgets') {
        viewToRender = <Budgets budgets={this.state.budgets} />;
      } else {
        viewToRender =  <Transactions transactions={this.state.transactions} budget={this.state.viewingBudget} />
      }
    } else {

      viewToRender = <Login />
    }
    

    return (
      <div className="App">
        <div className="loading-screen">
          <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
        <Nav view={this.state.view}
             previousView={this.state.previousView}
             viewingBudget={this.state.viewingBudget}
             categories={this.state.budgets}/>
        {viewToRender}
      </div>
    );
  }
}

export default App;