import {MyOrderHandler, OrderHandler} from '../src/order2';
import { expect } from 'chai';
import 'mocha';

describe('Class instance', 
  () => { 
    it('MyOrderHandler class total initial status is 0', () => { 
      const orderHandler: OrderHandler = new MyOrderHandler();
      orderHandler.getTotal()
      const total = orderHandler.getTotal();
      expect(total).to.equal(0); 
  }); 
});
let orderHandler: OrderHandler
describe('Class usage', 
   () => { 
    beforeEach(() => {
      orderHandler = new MyOrderHandler();
    })
    it('product does not exist', () => { 
      try {
        orderHandler.add(123123,1)        
      } catch (error) {
        expect(error.message).to.equal("Product is not found"); 
      }
    })
    it('wrong, negative quantity', () => { 
      try {
        orderHandler.add(123123,-2)        
      } catch (error) {
        expect(error.message).to.equal("There's a range of quantity between 1 and 30"); 
      }
    })
    it('wrong, exceeded quantity', () => { 
      try {
        orderHandler.add(123123,35)        
      } catch (error) {
        expect(error.message).to.equal("There's a range of quantity between 1 and 30"); 
      }
    })
    it('add item 12, should return 4.5 price', () => { 
        orderHandler.add(12,1) 
        expect(orderHandler.getTotal()).to.equal(4.5)       
    })
    it('add item 12 with 2 quantity, apply 2x1, should return 4.5 price', () => { 
        orderHandler.add(12,2) 
        expect(orderHandler.getTotal()).to.equal(4.5)       
    })
    it('add item 12 with 2 quantity, apply 2x1 plus 1 quantity of item 37, should return 11 price', () => { 
        orderHandler.add(12,2) 
        orderHandler.add(37,1)
        
        expect(orderHandler.getTotal()).to.equal(11)       
    })
    it('add item 12 with 2 quantity, item 37 and 21, menu offer plus item 12, should return 14 + 4.5 = 18.5 price', () => { 
        orderHandler.add(12,2)
        orderHandler.add(21,1)
        orderHandler.add(37,1)
        expect(orderHandler.getTotal()).to.equal(18.5)       
    })
    it('add 2 menus, should apply spend X save Y offer (14+14-5)', () => { 
      orderHandler.add(12,2)
      orderHandler.add(21,2)
      orderHandler.add(37,2)
      expect(orderHandler.getTotal()).to.equal(23)       
    })
    it('add 1 menu, plus 2 dishes (spend X save Y offer)', () => { 
      orderHandler.add(12,1)
      orderHandler.add(21,2)
      orderHandler.add(37,2)
      expect(orderHandler.getTotal()).to.equal(14+6.5+6-5)       
    })
});