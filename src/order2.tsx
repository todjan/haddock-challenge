
export interface OrderHandler {
    add: (number: number, quantity: number) => void;
    getTotal: () => number;
}
export type mealOffer = 'starter' | 'rice' | 'meat'

export interface product {
    id: number;
    name: string;
    price: number;
    meal: mealOffer;
    secondFreeOffer: boolean;
}

// start Database fill up
const papas: product = {
    id: 11,
    name: 'papas',
    price: 4,
    meal: 'starter',
    secondFreeOffer: true,
}
const springRolls: product = {
    id: 12,
    name: 'Spring rolls',
    price: 4.5,
    meal: 'starter',
    secondFreeOffer: true,
}
const friedRiceWithPork: product = {
    id: 21,
    name: 'Fried rice with pork',
    price: 6,
    meal: 'rice',
    secondFreeOffer: false,
}
const chickenWithAlmondSauce: product = {
    id: 37,
    name: 'Chicken with almond sauce',
    price: 6.5,
    meal: 'meat',
    secondFreeOffer: false,
}
let bbdd = [springRolls,friedRiceWithPork,chickenWithAlmondSauce,papas]
// end database fill up

/*
    menuFixedPrice?: number, sets menu price
    spendLimitDiscount?: number, sets spend total to reach and add  discount set on the next param
    discountSpendLimitReached?: number, set discount price once spendLimitDiscount is reached
*/
export class MyOrderHandler implements OrderHandler  {
    private order: Array<product> = []
    private total: number = 0
    private spendXsaveY = false
    private menuFixedPrice = 14
    private spendLimitDiscount = 20
    private discountSpendLimitReached = 5
    constructor(menuFixedPrice?: number, spendLimitDiscount?: number, discountSpendLimitReached?: number) {
        this.menuFixedPrice = menuFixedPrice || this.menuFixedPrice
        this.spendLimitDiscount = spendLimitDiscount || this.spendLimitDiscount
        this.discountSpendLimitReached = discountSpendLimitReached || this.discountSpendLimitReached
    }

    //adds products to order array
    add(productId:number, quantity: number) {
        if(quantity > 30 || quantity < 0) {
            throw new Error("There's a range of quantity between 1 and 30");
        }
        // ensure that find method returns a product type
        const product: product = bbdd.find((product) => product.id == productId) as product
        if(!product){
            throw new Error("Product is not found");
        }
        for (let i = 0; i < quantity; i++) {
            this.order.push(product)
        }
    }

    //generates order counter, mapping: 2x1 dishes, starter, rice and meat
    private dishesOrderCounter(): Object{
        return this.order.reduce(function(prev, cur) {
            prev[cur.meal] = (prev[cur.meal] || [])
            prev[cur.meal].push(cur.id)

            if(cur.secondFreeOffer){
                prev[cur.id] = (prev[cur.id] || 0) + 1;
            }
            return prev;
        }, {});
    }

    //when there's at least 1 of each (starter, rice and meat), apply menu offer
    private menusCalc(dishesCounter:Object): void {
        if(dishesCounter['starter'] && dishesCounter['rice'] && dishesCounter['meat']){
            //get min number to guess how many menus apply
            const menusCount = Math.min(dishesCounter['starter'].length,dishesCounter['rice'].length,dishesCounter['meat'].length)
            this.total += menusCount * this.menuFixedPrice

            //update counter object status
            let deletedProducts = dishesCounter['starter'].splice(0,menusCount)
            deletedProducts.forEach((productId => dishesCounter[productId]--))
            dishesCounter['rice'].splice(0,menusCount)
            dishesCounter['meat'].splice(0,menusCount)
        }
    }

    //adds 2x1 offer of remaining products, if there are enough to add
    private secondFreeCalc(dishesCounter:Object): void {
        let products2x1: product[] = this.order.filter((product) => product.secondFreeOffer) as product[]
        products2x1 = Array.from(new Set(products2x1))
        if(products2x1.length > 0){
            products2x1.forEach((product2x1) => {        
                const promo2x1 = Math.floor(dishesCounter[product2x1.id] / 2)  
                this.total += promo2x1 * product2x1.price
                dishesCounter['starter'].splice(0,dishesCounter[product2x1.id])
                if( dishesCounter[product2x1.id] % 2 == 1) {
                    this.total += product2x1.price
                }
            })
        }
    }

    // add products without offer
    private restCalc(dishesCounter:Object): void {
        if(dishesCounter['starter']){
            dishesCounter['starter'].forEach((id) => {
                const productFound: product = this.order.find((product) => product.id == id) as product
                this.total += productFound.price
            })
        }
        if(dishesCounter['rice']){
            dishesCounter['rice'].forEach((id) => {
                const productFound: product = this.order.find((product) => product.id == id) as product
                this.total += productFound.price
            })
        }
        if(dishesCounter['meat']){
            dishesCounter['meat'].forEach((id) => {
                const productFound: product = this.order.find((product) => product.id == id) as product
                this.total += productFound.price
            })
        }
    }

    // checks if total is higher than spendLimitDiscount set, applied once
    private spendXsaveYcalc():void {
        if(this.total > this.spendLimitDiscount && !this.spendXsaveY){
            this.spendXsaveY = true
            this.total -= this.discountSpendLimitReached
        }
    }

    // total combination of applied offers
    getTotal():number{
        const dishesCounter = this.dishesOrderCounter()
        this.menusCalc(dishesCounter)
        this.secondFreeCalc(dishesCounter)
        this.restCalc(dishesCounter)
        this.spendXsaveYcalc()
        return this.total
    }
}

const orderHandler: OrderHandler = new MyOrderHandler();
orderHandler.add(12, 4)
orderHandler.add(21, 2);
//orderHandler.add(37, 1);
const total = orderHandler.getTotal();
console.log(total); // 16.00€

