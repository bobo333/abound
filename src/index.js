import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {calculateGraphData} from './independenceCalculations.js';


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
        <form onSubmit={(e) => this.nextSlide(e)}>
          income
          <div className='income-input'>
            <input type='text' placeholder='$3500' value={this.state.monthlyIncome} onChange={(e) => this.updateIncome(e)} />
            <br/>
            <input type='submit' value='Next' />
          </div>
        </form>
      );
    } else if (this.state.currentSlide === 1) {
      return (
        <form onSubmit={(e) => this.nextSlide(e)}>
          expenses
          <div className='spend-input'>
            <input type='text' placeholder='$2500' value={this.state.monthlySpend} onChange={(e) => this.updateSpend(e)} />
            <br/>
            <input type='button' value='Back' onClick={(e) => this.previousSlide(e)} />
            <input type='submit' value='Next' />
          </div>
        </form>
      );
    } else if (this.state.currentSlide === 2) {
      return (
        <form onSubmit={(e) => this.nextSlide(e)}>
          savings
          <div className='savings-input'>
            <input type='text' placeholder='$250000' value={this.state.totalSavings} onChange={(e) => this.updateSavings(e)} />
            <br/>
            <input type='button' value='Back' onClick={(e) => this.previousSlide(e)} />
            <input type='submit' value='Next' />
          </div>
        </form>
      );
    } else {
      const graphData = calculateGraphData(this.state.monthlySpend, this.state.monthlyIncome, this.state.totalSavings);

      return (
        <div>
          <div>income: {this.state.monthlyIncome}</div>
          <div>spend: {this.state.monthlySpend}</div>
          <div>savings: {this.state.totalSavings}</div>
          <input type='button' value='Back' onClick={(e) => this.previousSlide(e)} />
          <br/>
          <svg id='the-graph' />
          <br/>
          <div><pre>{JSON.stringify(graphData, null, 2)}</pre></div>
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
