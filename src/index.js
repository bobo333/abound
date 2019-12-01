import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {calculateGraphData} from './independenceCalculations.js';
import {InputForm} from './inputForm.js';
import Chart from './chart.js';
import {Header} from './header.js';

function sanitizeInput(input) {
  return parseFloat(input) || 0;
}

function getDateDiff(inDate) {
  let now = new Date();

  let years = inDate.getFullYear() - now.getFullYear();
  let months = inDate.getMonth() - now.getMonth();
  let days = inDate.getDate() - now.getDate();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (days < 0) {
    months--;
    days += 30;
  }

  let pieces = [];

  if (years === 1) {
    pieces.push(years + " year");
  } if (years > 1) {
    pieces.push(years + " years");
  } if (months === 1) {
    pieces.push(months + " month");
  } if (months > 1) {
    pieces.push(months + " months");
  } if (days === 1) {
    pieces.push(days + " day");
  } if (days > 1) {
    pieces.push(days + " days");
  }

  console.log(pieces);

  if (pieces.length > 1) {
    pieces.splice(pieces.length - 1, 0, " and ");
  }

  console.log(pieces);

  // either fix the comma after the 'and' and/or don't display full data all the time

  return pieces.join(", ")
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

      // handle never going to retire
      // can retire already

      return (
        <div class="container-fluid">
        <Header />
          <div class="row mt-5">
            On course for financial independence in: {getDateDiff(graphData.intersectionPoint.x)}
          </div>
          <Chart data={graphData} />

          <div class="row mt-5">
            <div class="col-4 fin-input">
              <input type='text' placeholder='$3500' value={this.state.monthlyIncome} onChange={(e) => this.updateState(e, 'monthlyIncome')} />
              <br />
              income ($)
            </div>
            <div class="col-4 fin-input">
              <input type='text' placeholder='$2500' value={this.state.monthlySpend} onChange={(e) => this.updateState(e, 'monthlySpend')} />
              <br />
              spend ($)
            </div>
            <div class="col-4 fin-input">
              <input type='text' placeholder='$250000' value={this.state.totalSavings} onChange={(e) => this.updateState(e, 'totalSavings')} />
              <br />
              savings ($)
            </div>
          </div>
          <div class="row mt-5 mb-5" id="additional-variables" data-toggle="additional-variables">
            <div class="col-3 fin-input">
              <input type='text' placeholder='3.5' value={this.state.inflationRate} onChange={(e) => this.updateState(e, 'inflationRate')} />
              <br />
              inflation (%)
            </div>
            <div class="col-3 fin-input">
              <input type='text' placeholder='4' value={this.state.withdrawalRate} onChange={(e) => this.updateState(e, 'withdrawalRate')} />
              <br />
              withdrawal rate (%)
            </div>
            <div class="col-3 fin-input">
              <input type='text' placeholder='7.5' value={this.state.growthRate} onChange={(e) => this.updateState(e, 'growthRate')} />
              <br />
              growth rate (%)
            </div>
            <div class="col-3 fin-input">
              <input type='text' placeholder='5' value={this.state.incomeRate} onChange={(e) => this.updateState(e, 'incomeRate')} />
              <br />
              income increase rate (%)
            </div>
          </div>
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
