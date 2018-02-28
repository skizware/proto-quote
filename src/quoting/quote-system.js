import React, {Component} from 'react';

const newUuid = function(){
    return Math.random().toString(36).substr(2, 9);
};

class Quote extends Component {

    constructor(props) {
        super(props);

        this.state = props.stateVal;
    }

    getQuoteCategoryKeys() {
        return Object.keys(this.state.quoteCategories) || [];
    }

    getQuoteCategoryByKey(someKey) {
        return this.state.quoteCategories[someKey];
    }

    updateCategory(catKey, catState) {
        const newState = this.state;
        newState.quoteCategories[catKey] = catState;
        this.setState(newState);
        console.log(this.state);
    }

    addNewCategory(){
        const catKey = newUuid();
        this.updateCategory(catKey, {});
    }

    render() {
        return (
            <div>
                {this.getQuoteCategoryKeys().map((someKey, i) => {
                    const props = {
                        stateVal: this.getQuoteCategoryByKey(someKey),
                        orderIndex: i,
                        uuid: someKey,
                        updateCallback: this.updateCategory.bind(this)
                    };
                    return <QuoteSection {...props}/>;
                })}
                <a href="#" onClick={this.addNewCategory.bind(this)}>+ Create new section</a>
            </div>
        );
    }

}

class QuoteSection extends Component {
    constructor(props) {
        super(props);

        this.state = props.stateVal;
        this.props = props;
    }

    getSubCategoryKeys() {
        if (this.state.subCategories !== undefined) {
            return Object.keys(this.state.subCategories)
        } else {
            return []
        }
    }

    getSubCategoryByKey(someKey) {
        return this.state.subCategories[someKey];
    }

    getQuoteItemKeys() {
        if (this.state.quoteItems !== undefined) {
            return Object.keys(this.state.quoteItems);
        }
        else {
            return [];
        }
    }

    getQuoteItemByKey(key) {
        return this.state.quoteItems[key];
    }

    updateParent(){
        this.props.updateCallback(this.props.uuid, this.state);
    }

    onNameChange(evt){
        const newState = this.state;
        newState.categoryName = evt.target.value;
        this.setState(newState);
        this.updateParent();
    }

    updateSubCategory(subCatKey, subCatState){
        const newState = this.state;
        newState.subCategories[subCatKey] = subCatState;
        this.setState(newState);
        this.updateParent();
    }

    addNewSubCategory(){
        const newState = this.state;
        if(!newState.subCategories){
            newState.subCategories = {};
        }
        newState.subCategories[newUuid()] = {};
        this.setState(newState);
        this.updateParent();
    }


    render() {
        const theKeys = this.getSubCategoryKeys();
        const quoteItemKeys = this.getQuoteItemKeys();
        let addNewSubCat = null;
        if(!this.props.isSubCategory){
            addNewSubCat = <a href="#" onClick={this.addNewSubCategory.bind(this)}>+ Add new sub-category</a>
        }
        return (
            <div>
                <span>{''+(this.props.orderIndex + 1) + ' - '}</span>
                <input id={this.props.uuid}
                     key={this.props.uuid} defaultValue={this.state.categoryName} onChange={this.onNameChange.bind(this)}/>
                {quoteItemKeys.map((key, i) => {
                    return <QuoteItem stateVal={this.getQuoteItemByKey(key)} orderIndex={i} uuid={key} key={key}/>;
                })}
                {theKeys.map((key, i) => {
                    {
                        const props = {
                            stateVal: this.getSubCategoryByKey(key),
                            orderIndex: i,
                            uuid: key,
                            updateCallback: this.updateSubCategory.bind(this),
                            isSubCategory: true
                        };

                    return <QuoteSection {...props}/>}
                })}
                {addNewSubCat}
            </div>
        )
    }
}

class QuoteItem extends Component {
    constructor(props) {
        super(props);

        this.state = props.stateVal;
        this.props = props;
    }

    getQuantityJsx() {
        return this.state.itemQuantityAndUnitsList.map((quantityObject) => {
            return quantityObject.quantities.map((individualQuantity, idx) => {
                return (
                    <span>
                        <span>{individualQuantity.quantity}&nbsp;</span>
                        <span>{individualQuantity.label}{individualQuantity.label !== '' ? ' ' : ''}</span>
                        <span>{quantityObject.unit}{quantityObject.quantities.length - 1 !== idx ? ', ' : '. '}</span>
                    </span>
                )
            });
        });
    }


    render() {
        return (
            <div key={this.props.uuid}>
                <span>{this.state.itemName} </span>
                {this.getQuantityJsx()}
            </div>
        );

    }
}


export default Quote;