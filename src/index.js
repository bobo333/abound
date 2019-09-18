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
      currentSlide: 0
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

  nextSlide(event) {
    event.preventDefault();
    this.setState({currentSlide: this.state.currentSlide + 1});
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
      const graphData = calculateGraphData(parseFloat(this.state.monthlySpend), parseFloat(this.state.monthlyIncome), parseFloat(this.state.totalSavings));

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
          <input type='button' value='Back' onClick={(e) => this.previousSlide(e)} />
          <Chart data={graphData} />
          <div><pre>{JSON.stringify(graphData, null, 2)}</pre></div>
        </div>
      );
    }
  }
}

// ========================================

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
