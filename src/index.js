import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {calculateGraphData} from './independenceCalculations.js';
import {InputForm} from './inputForm.js';
import Chart from './chart.js';


class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthlyIncome: '',
      monthlySpend: '',
      totalSavings: '',
      currentSlide: 0,
      rates: {
        withdrawal: 0.04,
        inflation: 0.035,
        growth: 0.075,
        income: 0.05,
      }
    };
  }

  updateIncome(event) {
    this.setState({monthlyIncome: event.target.value});
  }

  updateSpend(event) {
    this.setState({monthlySpend: event.target.value});
  }

  updateSavings(event) {
    this.setState({totalSavings: event.target.value});
  }

  updateInflation(event) {
    var newRates = this.state.rates;
    newRates.inflation = event.target.value;
    this.setState({rates: newRates});
  }

  updateWithdrawal(event) {
    var newRates = this.state.rates;
    newRates.withdrawal = event.target.value;
    this.setState({rates: newRates});
  }

  updateGrowth(event) {
    var newRates = this.state.rates;
    newRates.growth = event.target.value;
    this.setState({rates: newRates});
  }

  updateIncomeRate(event) {
    var newRates = this.state.rates;
    newRates.income = event.target.value;
    this.setState({rates: newRates});
  }

  nextSlide(event) {
    event.preventDefault();
    this.setState({currentSlide: this.state.currentSlide + 1});
  }

  sanitizeRates(rates) {
    const newRates = {}
    for (var key in rates) {
      newRates[key] = this.sanitizeInput(rates[key])
    }
    return newRates
  }

  sanitizeInput(input) {
    return parseFloat(input) || 0;
  }

  previousSlide(event) {
    event.preventDefault();
    this.setState({currentSlide: this.state.currentSlide - 1});
  }

  render() {
    if (this.state.currentSlide === 0){
      return(
        <InputForm name='income' onSubmit={(e) => this.nextSlide(e)} placeholder='$3500'
                   value={this.state.monthlyIncome} onChange={(e) => this.updateIncome(e)} />
      );
    } else if (this.state.currentSlide === 1) {
      return (
        <InputForm name='expenses' onSubmit={(e) => this.nextSlide(e)} placeholder='$2500'
                   value={this.state.monthlySpend} onChange={(e) => this.updateSpend(e)}
                   backOnClick={(e) => this.previousSlide(e)} />
      );
    } else if (this.state.currentSlide === 2) {
      return (
        <InputForm name='savings' onSubmit={(e) => this.nextSlide(e)} placeholder='$250000'
                   value={this.state.totalSavings} onChange={(e) => this.updateSavings(e)}
                   backOnClick={(e) => this.previousSlide(e)} />
      );
    } else {
      const graphData = calculateGraphData(
        this.sanitizeInput(this.state.monthlySpend),
        this.sanitizeInput(this.state.monthlyIncome),
        this.sanitizeInput(this.state.totalSavings),
        this.sanitizeRates(this.state.rates));

      return (
        <div>
          <div>income:
            <input type='text' placeholder='$3500' value={this.state.monthlyIncome} onChange={(e) => this.updateIncome(e)} />
          </div>
          <div>spend:
            <input type='text' placeholder='$2500' value={this.state.monthlySpend} onChange={(e) => this.updateSpend(e)} />
          </div>
          <div>savings:
            <input type='text' placeholder='$250000' value={this.state.totalSavings} onChange={(e) => this.updateSavings(e)} />
          </div>
          <div>inflation (%):
            <input type='text' placeholder='0.035' value={this.state.rates.inflation} onChange={(e) => this.updateInflation(e)} />
          </div>
          <div>withdrawal rate (%):
            <input type='text' placeholder='0.04' value={this.state.rates.withdrawal} onChange={(e) => this.updateWithdrawal(e)} />
          </div>
          <div>growth rate (%):
            <input type='text' placeholder='0.075' value={this.state.rates.growth} onChange={(e) => this.updateGrowth(e)} />
          </div>
          <div>income increase rate (%):
            <input type='text' placeholder='0.05' value={this.state.rates.income} onChange={(e) => this.updateIncomeRate(e)} />
          </div>
          <input type='button' value='Back' onClick={(e) => this.previousSlide(e)} />
          <Chart data={graphData} />
          <div><pre>{JSON.stringify(graphData, null, 2)}</pre></div>
        </div>
      );
    }
  }
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
