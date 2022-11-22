 * Requirements
    node v16.18.0
    npm install typescript
    npm install chai mocha ts-node @types/chai @types/mocha --save-dev
    
 * Test execution
    npm run test

 * Script execution
    npm run script

 * Script usaage
    In order to try the script, you should edit ./src/order2.tsx

    new MyOrderHandler() has 3 optional arguments: 
    menuFixedPrice?: number, sets menu price
    spendLimitDiscount?: number, sets spend total to reach and add  discount set on the next param
    discountSpendLimitReached?: number, set discount price once spendLimitDiscount is reached

    then MyOrderHandler instance has "add" method with 2 arguments:
    productId, product you wish to order
    quantity, amount of this product you want ( max limit of 30 by default )

    on MyOrderHandler instance you can check the total by calling getTotal() function.
