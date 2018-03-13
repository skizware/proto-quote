import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Quote from './quoting/quote-system-ui';

const testData = {
    dateCreated: "2018-02-22",
    currency: "ZAR",
    quoteConfig: {
        markUpRate: 1.12
    },
    quoteCategories: {
        "44g423f":{
            categoryName: "CAST & CASTING",
            quoteItems: {},
            subCategories: {
                "45dsgs43":{
                    categoryName: "CASTING - JOHANNESBURG",
                    quoteItems: {
                        "87dsf78":{
                            itemName: "CASTING DIRECTOR PREP / RESEARCH",
                            subQuoteItems: [],
                            itemRate: 350000, //always using cents
                            markupPercent: "cfg_markUpRate",
                            totalQuantityUnit: "days",
                            itemQuantityAndUnitsList: [
                                {
                                    quantities:[
                                        {quantity: 2, label: ""}
                                    ],
                                    unit: "persons"
                                },
                                {
                                    quantities: [
                                        {quantity: 1, label: "prep/post"},
                                        {quantity: 2, label: "shoot"}
                                    ],
                                    unit: "days"
                                }
                            ]
                        },
                        "87dsf79":{
                            itemName: "CASTING INCL CASTING DIR. & STUDIO",
                            subQuoteItems: [],
                            itemRate: 875000, //always using cents
                            markupPercent: "cfg_markUpRate",
                            itemQuantityAndUnitsList: [
                                {
                                    quantities:[
                                        {quantity: 2, label: ""}
                                    ],
                                    unit: "days"
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Quote stateVal={testData} key={123}/>
      </div>
    );
  }
}

export default App;
