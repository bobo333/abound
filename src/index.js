import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {calculateGraphData} from './independenceCalculations.js';
import {InputForm} from './inputForm.js';
import Chart from './chart.js';


function sanitizeInput(input) {
  return parseFloat(input) || 0;
}


class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthlyIncome: '',
      monthlySpend: '',
      totalSavings: '',
      currentSlide: 0,
      withdrawalRate: 4,
      inflationRate: 3.5,
      growthRate: 7.5,
      incomeRate: 5,
    };
  }

  updateState(event, name) {
    this.setState({[name]: event.target.value})
  }

  nextSlide(event) {
    event.preventDefault();
    this.setState({currentSlide: this.state.currentSlide + 1});
  }

  getRates() {
    return {
      withdrawal: sanitizeInput(this.state.withdrawalRate) / 100,
      inflation: sanitizeInput(this.state.inflationRate) / 100,
      growth: sanitizeInput(this.state.growthRate) / 100,
      income: sanitizeInput(this.state.incomeRate) / 100,
    }
  }

  previousSlide(event) {
    event.preventDefault();
    this.setState({currentSlide: this.state.currentSlide - 1});
  }

  render() {
    if (this.state.currentSlide === 0){
      return(
        <InputForm name='income' onSubmit={(e) => this.nextSlide(e)} placeholder='$3500'
                   value={this.state.monthlyIncome} onChange={(e) => this.updateState(e, 'monthlyIncome')} />
      );
    } else if (this.state.currentSlide === 1) {
      return (
        <InputForm name='expenses' onSubmit={(e) => this.nextSlide(e)} placeholder='$2500'
                   value={this.state.monthlySpend} onChange={(e) => this.updateState(e, 'monthlySpend')}
                   backOnClick={(e) => this.previousSlide(e)} />
      );
    } else if (this.state.currentSlide === 2) {
      return (
        <InputForm name='savings' onSubmit={(e) => this.nextSlide(e)} placeholder='$250000'
                   value={this.state.totalSavings} onChange={(e) => this.updateState(e, 'totalSavings')}
                   backOnClick={(e) => this.previousSlide(e)} />
      );
    } else {
      const graphData = calculateGraphData(
        sanitizeInput(this.state.monthlySpend),
        sanitizeInput(this.state.monthlyIncome),
        sanitizeInput(this.state.totalSavings),
        this.getRates());

      return (
        <div>
          <div>income:
            <input type='text' placeholder='$3500' value={this.state.monthlyIncome} onChange={(e) => this.updateState(e, 'monthlyIncome')} />
          </div>
          <div>spend:
            <input type='text' placeholder='$2500' value={this.state.monthlySpend} onChange={(e) => this.updateState(e, 'monthlySpend')} />
          </div>
          <div>savings:
            <input type='text' placeholder='$250000' value={this.state.totalSavings} onChange={(e) => this.updateState(e, 'totalSavings')} />
          </div>
          <div>inflation (%):
            <input type='text' placeholder='3.5' value={this.state.inflationRate} onChange={(e) => this.updateState(e, 'inflationRate')} />
          </div>
          <div>withdrawal rate (%):
            <input type='text' placeholder='4' value={this.state.withdrawalRate} onChange={(e) => this.updateState(e, 'withdrawalRate')} />
          </div>
          <div>growth rate (%):
            <input type='text' placeholder='7.5' value={this.state.growthRate} onChange={(e) => this.updateState(e, 'growthRate')} />
          </div>
          <div>income increase rate (%):
            <input type='text' placeholder='5' value={this.state.incomeRate} onChange={(e) => this.updateState(e, 'incomeRate')} />
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
