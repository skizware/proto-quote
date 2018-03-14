const KEY_DATE_CREATED = 'dateCreated';
const KEY_CURRENCY = 'currency';
const KEY_QUOTE_CFG = 'quoteConfig';
const KEY_CATEGORY_NAME = 'categoryName';
const KEY_QUOTE_CATEGORIES = "quoteCategories";
const KEY_CATEGORY_QUOTE_ITEMS_LIST = "quoteItems";
const KEY_QUOTE_ITEM_MARKUP_PERCENT = "markupPercent";
const KEY_QUOTE_ITEM_NAME = 'itemName';
const KEY_QUOTE_ITEM_RATE = 'itemRate';
const KEY_QUOTE_ITEM_OVERALL_QUANTITY_LABEL = 'totalQuantityUnit';
const KEY_QUOTE_ITEM_SUB_ITEMS = "subQuoteItems";
const KEY_QUOTE_ITEM_QUANTITY_AND_UNITS_LIST = "itemQuantityAndUnitsList";
const KEY_QUANTITIES_LIST = 'quantities';
const KEY_SUB_CATEGORIES_LIST = "subCategories";
const KEY_COMPOSITE_QUANTITY_UNIT = "unit";
const KEY_LABELED_QUANTITY = "quantity";
const KEY_LABELED_QUANTITY_LABEL = "label";
const QUOTE_CONFIG_KEY_PREFIX = "cfg_";


class BaseQuoteElement {

    constructor(owningParent) {
        if (!owningParent) {
            throw Error("Parent must be defined");
        }
        this._owningParent = owningParent;
    }

    getParent() {
        return this._owningParent;
    }

    getQuoteParent() {
        if (this.getParent() && this.getParent().getQuoteParent) {
            return this.getParent().getQuoteParent()
        } else {
            return this.getParent();
        }
    }

    _getQuoteConfigElement(configKey) {
        return this.getQuoteParent().getQuoteConfig()[configKey.substr(QUOTE_CONFIG_KEY_PREFIX.length)];
    }

    _isPropertyFromConfig(property){
        return (typeof property === "string" && property.indexOf(QUOTE_CONFIG_KEY_PREFIX) !== -1);
    }

    getProperty(property){
        if(this._isPropertyFromConfig(property)){
            return this._getQuoteConfigElement(property)
        }else {
            return property;
        }
    }
}

class Quote {

    constructor(data) {
        this._quoteCategories = [];
        this._dateCreated = data[KEY_DATE_CREATED] || Date.parse(new Date().toUTCString());
        this._currency = data[KEY_CURRENCY];
        this._quoteConfig = data[KEY_QUOTE_CFG];

        if (data[KEY_QUOTE_CATEGORIES]) {
            data[KEY_QUOTE_CATEGORIES].map((categoryData) => {
                this._quoteCategories.push(new ParentCategory(this, categoryData));
            });
        }
    }

    getTotal() {
        return this._quoteCategories.reduce((runningTotal, category) => {
            return runningTotal + category.getTotal();
        }, 0);
    }

    getQuoteConfig(){
        return this._quoteConfig;
    }

    toJson() {
        let jsonRepresentation = {};
        jsonRepresentation[KEY_DATE_CREATED] = this._dateCreated;
        jsonRepresentation[KEY_CURRENCY] = this._currency;
        jsonRepresentation[KEY_QUOTE_CFG] = this._quoteConfig;
        jsonRepresentation[KEY_QUOTE_CATEGORIES] = [];
        this._quoteCategories.map((quoteCategory) => {
            jsonRepresentation[KEY_QUOTE_CATEGORIES].push(quoteCategory.toJson());
        });
        return jsonRepresentation;
    }

}

class QuoteCategory extends BaseQuoteElement {

    constructor(owningParent, data) {
        super(owningParent);
        this._categoryName = data[KEY_CATEGORY_NAME];
        this._quoteItems = [];
        if (data[KEY_CATEGORY_QUOTE_ITEMS_LIST]) {
            data[KEY_CATEGORY_QUOTE_ITEMS_LIST].map((quoteItemData) => {
                console.log("this = " + this + " " + this._categoryName);
                this._quoteItems.push(new QuoteItem(this, quoteItemData));
            });
        }
    }

    addQuoteItem(quoteItem) {
        this.quoteItems.push(quoteItem);
    }

    getTotal() {
        return this._quoteItems.reduce((runningTotal, quoteItem) => {
            return runningTotal + quoteItem.getTotal();
        }, 0)
    }

    toJson() {
        let jsonRepresentation = {};
        jsonRepresentation[KEY_CATEGORY_NAME] = this._categoryName;
        jsonRepresentation[KEY_CATEGORY_QUOTE_ITEMS_LIST] = [];
        this._quoteItems.map((quoteItem) => {
            jsonRepresentation[KEY_CATEGORY_QUOTE_ITEMS_LIST].push(quoteItem.toJson());
        });
        return jsonRepresentation;
    }
}

class ParentCategory extends QuoteCategory {

    constructor(owningQuote, data) {
        super(owningQuote, data);
        this._subCategories = [];
        if (data[KEY_SUB_CATEGORIES_LIST]) {
            data[KEY_SUB_CATEGORIES_LIST].map((subCategoryData) => {
                this._subCategories.push(new QuoteCategory(this, subCategoryData));
            });
        }
    }

    getTotal() {
        let parentTotal = super.getTotal();
        return this._subCategories.reduce((runningTotal, subCategory) => {
            return runningTotal + subCategory.getTotal();
        }, parentTotal);

    }

    toJson() {
        let jsonRepresentation = super.toJson();
        jsonRepresentation[KEY_SUB_CATEGORIES_LIST] = [];
        this._subCategories.map((subCategory) => {
            jsonRepresentation[KEY_SUB_CATEGORIES_LIST].push(subCategory.toJson());
        });
        return jsonRepresentation;
    }

}

class QuoteItem extends BaseQuoteElement {

    constructor(owningParent, data) {
        super(owningParent);
        this._itemName = data[KEY_QUOTE_ITEM_NAME];
        console.log("owningParent = " + owningParent + " " + this._owningParent._categoryName);
        this._itemRate = data[KEY_QUOTE_ITEM_RATE];
        this._itemMarkup = data[KEY_QUOTE_ITEM_MARKUP_PERCENT];
        this._totalQuantityLabel = data[KEY_QUOTE_ITEM_OVERALL_QUANTITY_LABEL];
        this._compositeQuantityList = [];
        if (data[KEY_QUOTE_ITEM_QUANTITY_AND_UNITS_LIST]) {
            data[KEY_QUOTE_ITEM_QUANTITY_AND_UNITS_LIST].map((compositeQuantityData) => {
                this._compositeQuantityList.push(new CompositeQuantity(compositeQuantityData));
            });
        }
    }

    _getMarkupRate() {
        return this.getProperty(this._itemMarkup)
    }

    getTotal() {
        let totalQuantity = this._compositeQuantityList.reduce((previousValue, currentCompositeQuantity) => {
            return previousValue * currentCompositeQuantity.getSummedQuantities();
        }, 1);

        let totalExMarkup = totalQuantity * this._itemRate;

        console.log(this._getMarkupRate());

        return totalExMarkup * this._getMarkupRate();
    }

    toJson() {
        let jsonRepresentation = {};
        jsonRepresentation[KEY_QUOTE_ITEM_NAME] = this._itemName;
        jsonRepresentation[KEY_QUOTE_ITEM_RATE] = this._itemRate;
        jsonRepresentation[KEY_QUOTE_ITEM_MARKUP_PERCENT] = this._itemMarkup;
        jsonRepresentation[KEY_QUOTE_ITEM_OVERALL_QUANTITY_LABEL] = this._totalQuantityLabel;
        jsonRepresentation[KEY_QUOTE_ITEM_QUANTITY_AND_UNITS_LIST] = [];
        this._compositeQuantityList.map((compositeQuantity) => {
            jsonRepresentation[KEY_QUOTE_ITEM_QUANTITY_AND_UNITS_LIST].push(compositeQuantity.toJson());
        });
        return jsonRepresentation;
    }
}

class LabeledQuantity {

    constructor(quantity, label) {
        this._quantity = quantity;
        this.label = label;
    }

    getQuantity() {
        return this._quantity;
    }

    toJson() {
        let jsonRepresentation = {};
        jsonRepresentation[KEY_LABELED_QUANTITY] = this._quantity;
        jsonRepresentation[KEY_LABELED_QUANTITY_LABEL] = this.label;
        return jsonRepresentation;
    }
}

class CompositeQuantity {

    constructor(data) {
        this._labeledQuantityList = [];
        this._overallUnit = data[KEY_COMPOSITE_QUANTITY_UNIT];
        if (data[KEY_QUANTITIES_LIST]) {
            data[KEY_QUANTITIES_LIST].map((labeledQuantityData) => {
                this._labeledQuantityList.push(new LabeledQuantity(labeledQuantityData[KEY_LABELED_QUANTITY], labeledQuantityData[KEY_LABELED_QUANTITY_LABEL]));
            });
        }
    }

    getSummedQuantities() {
        return this._labeledQuantityList.reduce((previousSum, labeledQuantity) => {
            return previousSum + labeledQuantity.getQuantity();
        }, 0);
    }

    toJson() {
        let jsonRepresentation = {};
        jsonRepresentation[KEY_COMPOSITE_QUANTITY_UNIT] = this._overallUnit;
        jsonRepresentation[KEY_QUANTITIES_LIST] = [];
        this._labeledQuantityList.map((labeledQuantity) => {
            jsonRepresentation[KEY_QUANTITIES_LIST].push(labeledQuantity.toJson());
        });
        return jsonRepresentation;
    }
}

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
                            totalQuantityUnit: "days",
                            itemQuantityAndUnitsList: [
                                {
                                    quantities: [
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
                        {
                            itemName: "CASTING INCL CASTING DIR. & STUDIO",
                            subQuoteItems: [],
                            itemRate: 875000, //always using cents
                            markupPercent: "cfg_markUpRate",
                            itemQuantityAndUnitsList: [
                                {
                                    quantities: [
                                        {quantity: 2, label: ""}
                                    ],
                                    unit: "days"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};