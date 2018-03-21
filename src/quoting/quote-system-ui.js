import React, {Component} from 'react';
import {Quote} from './quote-system';

const newUuid = function () {
    return Math.random().toString(36).substr(2, 9);
};

const numberWithSpaces = function (x) {
    let parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
};

const centsToFormattedCurrencyString = function (cents) {
    return numberWithSpaces((cents / 100).toFixed(2));
};

class QuoteEditor extends Component {

    constructor(props) {
        super(props);

        this.quoteModel = new Quote(props.stateVal);
        this.state = this.stateFromModel();
    }

    stateFromModel() {
        let newState = {};
        newState.quoteTitle = this.quoteModel.getTitle();
        newState.dateCreated = this.quoteModel.getDateCreated();
        newState.quoteSections = this.quoteModel.getQuoteCategories();
        newState.total = centsToFormattedCurrencyString(this.quoteModel.getTotal());
        return newState;
    }

    setTitle(evt) {
        evt.preventDefault();
        this.quoteModel.setTitle(evt.target.value);
        this.setState(this.stateFromModel());
    }

    render() {
        return (
            <div className="card quote">
                <div className="card-header">
                    <div className="row">
                        <div className="col-sm-9">
                            <textarea className="h2" placeholder={'Set Title...'} value={this.state.quoteTitle}
                                      onChange={this.setTitle.bind(this)}/>
                        </div>
                        <div className="col-sm-3">Date
                            Created: {new Date(this.state.dateCreated).toLocaleString()}</div>
                    </div>
                </div>
                <div className="card-body quote-sections">
                    {this.state.quoteSections.map((quoteCat) => {
                        let props = {
                            model: quoteCat
                        };
                        return <QuoteSection {...props} />
                    })}
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-sm-9"></div>
                        <div className="col-sm-3">Total: R{this.state.total}</div>
                    </div>
                </div>
            </div>
        );
    }

}

class QuoteSection extends Component {
    constructor(props) {
        super(props);

        this.quoteSectionModel = props.model;
        this.state = this.stateFromModel();
        this.props = props;
    }

    stateFromModel() {
        return {
            title: this.quoteSectionModel.getCategoryName(),
            subSections: this.quoteSectionModel.getSubCategories(),
            items: this.quoteSectionModel.getQuoteItems(),
            sectionTotal: centsToFormattedCurrencyString(this.quoteSectionModel.getTotal())
        };
    }

    setTitle(evt) {
        evt.preventDefault();
        this.quoteSectionModel.setCategoryName(evt.target.value);
        this.setState(this.stateFromModel());
    }


    render() {
        return (
            <div className="card quote-section">
                <div className="card-header">
                    <div className="row">
                        <div className="col-sm-9">
                        <textarea className="h4" placeholder="Set section title..." value={this.state.title}
                                  onChange={this.setTitle.bind(this)}/>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <div className="section-wrapper">
                        <ul className="list-group quote-item-list">
                            {this.state.items.map((quoteItem) => {
                                let props = {
                                    model: quoteItem
                                };
                                return (<li className="">
                                    <QuoteSectionItem {...props}/>
                                </li>)
                            })}
                        </ul>
                    </div>
                    <div className="quote-sections">
                        {this.state.subSections.map((subSection) => {
                            let props = {
                                model: subSection
                            };
                            return <QuoteSection {...props}/>
                        })}
                    </div>
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-sm-9"><span className="h5">Section Total</span></div>
                        <div className="col-sm-3">
                            <span className="h5">R{this.state.sectionTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class QuoteSectionItem extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        this.itemModel = props.model;
        this.state = this.stateFromModel();
    }

    stateFromModel() {
        return {
            title: this.itemModel.getItemName(),
            itemRate: centsToFormattedCurrencyString(this.itemModel.getItemRate()),
            itemMarkup: ((this.itemModel.getItemMarkup() - 1) * 100).toFixed(1),
            totalQuantity: this.itemModel.getTotalQuantity(),
            totalQuantityUnits: this.itemModel.getCompositeQuantity().getOverallUnit(),
            total: centsToFormattedCurrencyString(this.itemModel.getTotal())
        };
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-6">
                    <textarea placeholder="Set item title..." value={this.state.title}/>
                </div>
                <div className="col-sm-3">
                    <a href="">{this.state.totalQuantity}</a> {this.state.totalQuantityUnits} @ R{(this.state.itemRate)}/unit
                    +{this.state.itemMarkup}%
                </div>
                <div className="col-sm-3">
                    Total: R{this.state.total}
                </div>
            </div>
        )
    }
}


export default QuoteEditor;