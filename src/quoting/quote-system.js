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
const KEY_QUOTE_ITEM_LABELED_QUANTITIES_AND_UNIT = "labeledItemQuantities";
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

    _isPropertyFromConfig(property) {
        return (typeof property === "string" && property.indexOf(QUOTE_CONFIG_KEY_PREFIX) !== -1);
    }

    getProperty(property) {
        if (this._isPropertyFromConfig(property)) {
            return this._getQuoteConfigElement(property)
        } else {
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

    newCategory(categoryName) {
        let catProps = {};
        catProps[KEY_CATEGORY_NAME] = categoryName;
        let newCategory = new ParentCategory(this, catProps)
        this._quoteCategories.push(newCategory)
        return newCategory;
    }

    getTotal() {
        return this._quoteCategories.reduce((runningTotal, category) => {
            return runningTotal + category.getTotal();
        }, 0);
    }

    getQuoteConfig() {
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


    getQuoteCategories() {
        return this._quoteCategories;
    }

    getDateCreated() {
        return this._dateCreated;
    }

    setDateCreated(value) {
        this._dateCreated = value;
    }

    getCurrency() {
        return this._currency;
    }

    setCurrency(value) {
        this._currency = value;
    }

}

class QuoteCategory extends BaseQuoteElement {

    constructor(owningParent, data) {
        super(owningParent);
        this._categoryName = data[KEY_CATEGORY_NAME];
        this._quoteItems = [];
        if (data[KEY_CATEGORY_QUOTE_ITEMS_LIST]) {
            data[KEY_CATEGORY_QUOTE_ITEMS_LIST].map((quoteItemData) => {
                this._quoteItems.push(new QuoteItem(this, quoteItemData));
            });
        }
    }

    newQuoteItem(quoteItemName) {
        let itemProps = {};
        itemProps[KEY_QUOTE_ITEM_NAME] = quoteItemName;
        let newItem = new QuoteItem(this, itemProps);
        this._quoteItems.push(newItem);
        return newItem;
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

    getQuoteItems() {
        return this._quoteItems;
    }

    getCategoryName() {
        return this._categoryName;
    }

    setCategoryName(value) {
        this._categoryName = value;
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

    newSubCategory(subCatName) {
        let catProps = {};
        catProps[KEY_CATEGORY_NAME] = subCatName;
        let newSubCat = new QuoteCategory(this, catProps);
        this._subCategories.push(newSubCat);
        return newSubCat;
    }


    getSubCategories() {
        return this._subCategories;
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
        this._itemRate = data[KEY_QUOTE_ITEM_RATE] || 0;
        this._itemMarkup = data[KEY_QUOTE_ITEM_MARKUP_PERCENT] || 1.0;
        this._compositeQuantity = new CompositeQuantity(data[KEY_QUOTE_ITEM_LABELED_QUANTITIES_AND_UNIT]);
    }


    getItemName() {
        return this._itemName;
    }

    setItemName(value) {
        this._itemName = value;
    }

    getItemRate() {
        return this._itemRate;
    }

    setItemRate(value) {
        this._itemRate = value;
    }

    getItemMarkup() {
        return this._getMarkupRate()
    }

    setItemMarkup(value) {
        this._itemMarkup = value;
    }

    getCompositeQuantity() {
        return this._compositeQuantity;
    }

    _getMarkupRate() {
        return this.getProperty(this._itemMarkup)
    }

    setCompositeQuantity(value) {
        this._compositeQuantity = value;
    }

    getTotal() {
        return this._compositeQuantity.getTotalQuantity() * this._itemRate * this._getMarkupRate();
    }

    toJson() {
        let jsonRepresentation = {};
        jsonRepresentation[KEY_QUOTE_ITEM_NAME] = this._itemName;
        jsonRepresentation[KEY_QUOTE_ITEM_RATE] = this._itemRate;
        jsonRepresentation[KEY_QUOTE_ITEM_MARKUP_PERCENT] = this._itemMarkup;
        jsonRepresentation[KEY_QUOTE_ITEM_LABELED_QUANTITIES_AND_UNIT] = this._compositeQuantity.toJson();
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

    newLabeledQuantity(quantity, label) {
        this._labeledQuantityList.push(new LabeledQuantity(quantity, label));
    }


    getOverallUnit() {
        return this._overallUnit;
    }

    setOverallUnit(value) {
        this._overallUnit = value;
    }

    getTotalQuantity() {
        return this._labeledQuantityList.reduce((previousSum, labeledQuantity) => {
            return previousSum * labeledQuantity.getQuantity();
        }, 1);
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
                }
            ]
        }
    ]
};