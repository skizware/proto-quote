import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import QuoteEditor from './quoting/quote-system-ui';

const testData = {
    dateCreated: 1521014398000,
    currency: "ZAR",
    quoteConfig: {
        markUpRate: 1.12
    },
    quoteCategories: [
        {
            categoryName: "CAST & CASTING",
            quoteItems: [],
            subCategories: [
                {
                    categoryName: "CASTING - JOHANNESBURG",
                    quoteItems: [
                        {
                            itemName: "CASTING DIRECTOR PREP / RESEARCH",
                            subQuoteItems: [],
                            itemRate: 350000, //always using cents
                            markupPercent: "cfg_markUpRate",
                            labeledItemQuantities:
                                {
                                    quantities: [
                                        {quantity: 2, label: "directors"},
                                        {quantity: 3, label: "days"}
                                    ],
                                    unit: "days"
                                }

                        },
                        {
                            itemName: "CASTING INCL CASTING DIR. & STUDIO",
                            subQuoteItems: [],
                            itemRate: 875000, //always using cents
                            markupPercent: "cfg_markUpRate",
                            labeledItemQuantities:
                                {
                                    quantities: [
                                        {quantity: 2, label: ""}
                                    ],
                                    unit: "days"
                                }
                        }
                    ]
                },
                {
                    categoryName: "CASTING - CAPE TOWN",
                    quoteItems: [
                        {
                            itemName: "CASTING DIRECTOR PREP / RESEARCH",
                            subQuoteItems: [],
                            itemRate: 350000, //always using cents
                            markupPercent: "cfg_markUpRate",
                            labeledItemQuantities:
                                {
                                    quantities: [
                                        {quantity: 1, label: "directors"},
                                        {quantity: 3, label: "days"}
                                    ],
                                    unit: "days"
                                }

                        },
                        {
                            itemName: "CASTING INCL CASTING DIR. & STUDIO",
                            subQuoteItems: [],
                            itemRate: 875000, //always using cents
                            markupPercent: "cfg_markUpRate",
                            labeledItemQuantities:
                                {
                                    quantities: [
                                        {quantity: 2, label: ""}
                                    ],
                                    unit: "days"
                                }
                        }
                    ]
                }
            ]
        }
    ]
};

class App extends Component {
  render() {
    return (
      <div className="App container-fluid">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <QuoteEditor stateVal={testData} key={123}/>
      </div>
    );
  }
}

export default App;
