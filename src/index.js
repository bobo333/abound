import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {calculateGraphData} from './independence_calculations.js';


class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthly_income: '',
      monthly_spend: '',
      total_savings: '',
      current_slide: 0
    }

    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
    this.updateIncome = this.updateIncome.bind(this);
    this.updateSpend = this.updateSpend.bind(this);
    this.updateSavings = this.updateSavings.bind(this);
  }

  updateIncome(event) {
    const new_state = Object.assign({}, this.state);
    new_state.monthly_income = event.target.value;
    this.setState(new_state);
  }

  updateSpend(event) {
    const new_state = Object.assign({}, this.state);
    new_state.monthly_spend = event.target.value
    this.setState(new_state);
  }

  updateSavings(event) {
    const new_state = Object.assign({}, this.state);
    new_state.total_savings = event.target.value
    this.setState(new_state);
  }

  nextSlide(event) {
    event.preventDefault();
    const new_state = Object.assign({}, this.state);
    new_state.current_slide++;
    this.setState(new_state);
  }

  previousSlide(event) {
    event.preventDefault();
    const new_state = Object.assign({}, this.state);
    new_state.current_slide--;
    this.setState(new_state);
  }

  render() {
    if (this.state.current_slide === 0){
      return(
        <form onSubmit={this.nextSlide}>
          income
          <div className='income-input'>
            <input type='text' placeholder='$3500' value={this.state.monthly_income} onChange={this.updateIncome}></input>
            <br/>
            <input type='submit' value='Next'></input>
          </div>
        </form>
      );
    } else if (this.state.current_slide === 1) {
      return (
        <form onSubmit={this.nextSlide}>
          expenses
          <div className='spend-input'>
            <input type='text' placeholder='$2500' value={this.state.monthly_spend} onChange={this.updateSpend}></input>
            <br/>
            <input type='button' value='Back' onClick={this.previousSlide}></input>
            <input type='submit' value='Next'></input>
          </div>
        </form>
      );
    } else if (this.state.current_slide === 2) {
      return (
        <form onSubmit={this.nextSlide}>
          savings
          <div className='savings-input'>
            <input type='text' placeholder='$250000' value={this.state.total_savings} onChange={this.updateSavings}></input>
            <br/>
            <input type='button' value='Back' onClick={this.previousSlide}></input>
            <input type='submit' value='Next'></input>
          </div>
        </form>
      );
    } else {
      const graph_data = calculateGraphData(this.state.monthly_spend, this.state.monthly_income, this.state.total_savings);
      console.log(graph_data);

      return (
        <div>
          <div>income: {this.state.monthly_income}</div>
          <div>spend: {this.state.monthly_spend}</div>
          <div>savings: {this.state.total_savings}</div>
          <input type='button' value='Back' onClick={this.previousSlide}></input>
          <br/>
          <svg id='the-graph'></svg>
          <br/>
          <div><pre>{JSON.stringify(graph_data, null, 2)}</pre></div>
        </div>
      )
    }
  }
}

// ========================================

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
