"use strict";
exports.__esModule = true;
exports.MyOrderHandler = void 0;
// start Database fill up
var papas = {
    id: 11,
    name: 'papas',
    price: 4,
    meal: 'starter',
    secondFreeOffer: true
};
var springRolls = {
    id: 12,
    name: 'Spring rolls',
    price: 4.5,
    meal: 'starter',
    secondFreeOffer: true
};
var friedRiceWithPork = {
    id: 21,
    name: 'Fried rice with pork',
    price: 6,
    meal: 'rice',
    secondFreeOffer: false
};
var chickenWithAlmondSauce = {
    id: 37,
    name: 'Chicken with almond sauce',
    price: 6.5,
    meal: 'meat',
    secondFreeOffer: false
};
var bbdd = [springRolls, friedRiceWithPork, chickenWithAlmondSauce, papas];
// end database fill up
/*
    menuFixedPrice?: number, sets menu price
    spendLimitDiscount?: number, sets spend total to reach and add  discount set on the next param
    discountSpendLimitReached?: number, set discount price once spendLimitDiscount is reached
*/
var MyOrderHandler = /** @class */ (function () {
    function MyOrderHandler(menuFixedPrice, spendLimitDiscount, discountSpendLimitReached) {
        this.order = [];
        this.total = 0;
        this.spendXsaveY = false;
        this.menuFixedPrice = 14;
        this.spendLimitDiscount = 20;
        this.discountSpendLimitReached = 5;
        this.menuFixedPrice = menuFixedPrice || this.menuFixedPrice;
        this.spendLimitDiscount = spendLimitDiscount || this.spendLimitDiscount;
        this.discountSpendLimitReached = discountSpendLimitReached || this.discountSpendLimitReached;
    }
    //adds products to order array
    MyOrderHandler.prototype.add = function (productId, quantity) {
        if (quantity > 30 || quantity < 0) {
            throw new Error("There's a range of quantity between 1 and 30");
        }
        // ensure that find method returns a product type
        var product = bbdd.find(function (product) { return product.id == productId; });
        if (!product) {
            throw new Error("Product is not found");
        }
        for (var i = 0; i < quantity; i++) {
            this.order.push(product);
        }
    };
    //generates order counter, mapping: 2x1 dishes, starter, rice and meat
    MyOrderHandler.prototype.dishesOrderCounter = function () {
        return this.order.reduce(function (prev, cur) {
            prev[cur.meal] = (prev[cur.meal] || []);
            prev[cur.meal].push(cur.id);
            if (cur.secondFreeOffer) {
                prev[cur.id] = (prev[cur.id] || 0) + 1;
            }
            return prev;
        }, {});
    };
    //when there's at least 1 of each (starter, rice and meat), apply menu offer
    MyOrderHandler.prototype.menusCalc = function (dishesCounter) {
        if (dishesCounter['starter'] && dishesCounter['rice'] && dishesCounter['meat']) {
            //get min number to guess how many menus apply
            var menusCount = Math.min(dishesCounter['starter'].length, dishesCounter['rice'].length, dishesCounter['meat'].length);
            this.total += menusCount * this.menuFixedPrice;
            //update counter object status
            var deletedProducts = dishesCounter['starter'].splice(0, menusCount);
            deletedProducts.forEach((function (productId) { return dishesCounter[productId]--; }));
            dishesCounter['rice'].splice(0, menusCount);
            dishesCounter['meat'].splice(0, menusCount);
        }
    };
    //adds 2x1 offer of remaining products, if there are enough to add
    MyOrderHandler.prototype.secondFreeCalc = function (dishesCounter) {
        var _this = this;
        var products2x1 = this.order.filter(function (product) { return product.secondFreeOffer; });
        products2x1 = Array.from(new Set(products2x1));
        if (products2x1.length > 0) {
            products2x1.forEach(function (product2x1) {
                var promo2x1 = Math.floor(dishesCounter[product2x1.id] / 2);
                _this.total += promo2x1 * product2x1.price;
                dishesCounter['starter'].splice(0, dishesCounter[product2x1.id]);
                if (dishesCounter[product2x1.id] % 2 == 1) {
                    _this.total += product2x1.price;
                }
            });
        }
    };
    // add products without offer
    MyOrderHandler.prototype.restCalc = function (dishesCounter) {
        var _this = this;
        if (dishesCounter['starter']) {
            dishesCounter['starter'].forEach(function (id) {
                var productFound = _this.order.find(function (product) { return product.id == id; });
                _this.total += productFound.price;
            });
        }
        if (dishesCounter['rice']) {
            dishesCounter['rice'].forEach(function (id) {
                var productFound = _this.order.find(function (product) { return product.id == id; });
                _this.total += productFound.price;
            });
        }
        if (dishesCounter['meat']) {
            dishesCounter['meat'].forEach(function (id) {
                var productFound = _this.order.find(function (product) { return product.id == id; });
                _this.total += productFound.price;
            });
        }
    };
    // checks if total is higher than spendLimitDiscount set, applied once
    MyOrderHandler.prototype.spendXsaveYcalc = function () {
        if (this.total > this.spendLimitDiscount && !this.spendXsaveY) {
            this.spendXsaveY = true;
            this.total -= this.discountSpendLimitReached;
        }
    };
    // total combination of applied offers
    MyOrderHandler.prototype.getTotal = function () {
        var dishesCounter = this.dishesOrderCounter();
        this.menusCalc(dishesCounter);
        this.secondFreeCalc(dishesCounter);
        this.restCalc(dishesCounter);
        this.spendXsaveYcalc();
        return this.total;
    };
    return MyOrderHandler;
}());
exports.MyOrderHandler = MyOrderHandler;
var orderHandler = new MyOrderHandler();
orderHandler.add(12, 4);
orderHandler.add(21, 2);
//orderHandler.add(37, 1);
var total = orderHandler.getTotal();
console.log(total); // 16.00€
