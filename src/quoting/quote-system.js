const KEY_DATE_CREATED = 'dateCreated';
const KEY_CURRENCY = 'currency';
const KEY_QUOTE_CFG = 'quoteConfig';
const KEY_CATEGORY_NAME = 'categoryName';
const KEY_QUOTE_ITEM_NAME = 'itemName';
const KEY_QUOTE_ITEM_RATE = 'itemRate';
const KEY_QUOTE_ITEM_OVERALL_QUANTITY_LABEL = 'totalQuantityUnit';
const KEY_QUOTE_ITEM_SUB_ITEMS = "subQuoteItems";
const KEY_QUOTE_ITEM_QUANTITY_AND_UNITS_LIST = "itemQuantityAndUnitsList";
const KEY_COMPOSITE_QUANTITY_UNIT = "unit";
const KEY_LABELED_QUANTITY = "quantity";
const KEY_LABELED_QUANTITY_LABEL = "label";


class Quote {

    constructor(data) {
        console.log(data);
        this._quoteCategories = [];
        this._dateCreated = data[KEY_DATE_CREATED];
        this._currency = data[KEY_CURRENCY];
        this._quoteConfig = data[KEY_QUOTE_CFG];

        data["quoteCategories"].map((categoryData) => {
            this._quoteCategories.push(new ParentCategory(categoryData));
        });
    }

}

class QuoteCategory {

    constructor(data) {
        this._categoryName = data[KEY_CATEGORY_NAME];
        this._quoteItems = [];
        data["quoteItems"].map((quoteItemData) => {
            this._quoteItems.push(new ParentQuoteItem(quoteItemData));
        });
    }
}

class ParentCategory extends QuoteCategory {

    constructor(data) {
        super(data);
        this._subCategories = [];
        data["subCategories"].map((subCategoryData) => {
            this._subCategories.push(new QuoteCategory(subCategoryData));
        });
    }

}

class QuoteItem {

    constructor(data) {
        this._itemName = data[KEY_QUOTE_ITEM_NAME];
        this._itemRate = data[KEY_QUOTE_ITEM_RATE];
        this._itemMarkup = undefined;
        this._totalQuantityLabel = data[KEY_QUOTE_ITEM_OVERALL_QUANTITY_LABEL];
        this._compositeQuantityList = [];
        data[KEY_QUOTE_ITEM_QUANTITY_AND_UNITS_LIST].map((compositeQuantityData) => {
            this._compositeQuantityList.push(new CompositeQuantity(compositeQuantityData));
        });
    }
}

class ParentQuoteItem extends QuoteItem {

    constructor(data) {
        super(data);
        this._childQuoteItems = [];
        data[KEY_QUOTE_ITEM_SUB_ITEMS].map((subQuoteItemData) => {
            this._childQuoteItems.push(new QuoteItem(subQuoteItemData));
        });
    }
}

class LabeledQuantity {

    constructor(quantity, label) {
        this._quantity = quantity;
        this.label = label;
    }
}

class CompositeQuantity {

    /*constructor(labeledQuantityList, overallUnit) {
        this._labeledQuantityList = labeledQuantityList;
        this._overallUnit = overallUnit;
    }*/

    constructor(data) {
        this._labeledQuantityList = [];
        this._overallUnit = data[KEY_COMPOSITE_QUANTITY_UNIT];
        if (data.quantities) {
            data.quantities.map((labeledQuantityData) => {
                this._labeledQuantityList.push(new LabeledQuantity(labeledQuantityData[KEY_LABELED_QUANTITY], labeledQuantityData[KEY_LABELED_QUANTITY_LABEL]));
            });
        }
    }
}


const testData = {
    dateCreated: "2018-02-22",
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