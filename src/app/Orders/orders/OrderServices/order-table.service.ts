import { Injectable } from '@angular/core';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';
import OrderOperationMode from '../../OrdersTypesAndClasses/orderOperationMode';

@Injectable({
  providedIn: 'root'
})
export class OrderTableService {
  records: OrderforTableCell[] = [];
  selectedId: number;
  selectedRecord: OrderforTableCell;
  orderOperationMode: OrderOperationMode;
  constructor() {
  }


  getRecords(): OrderforTableCell[] {
    return this.records;
  }

  addRecordToTable(record: OrderforTableCell): void {
    this.records.push(record);
  }

  updateTableRecord(id: number, updatedRecord: OrderforTableCell): void {
    for (let i = 0; i < this.records.length; i++) {
      if (this.records[i].id === updatedRecord.id) {
        this.records[i] = updatedRecord;
      }
    }
  }

  deleteRecordById(id: number): any {
    this.records.forEach((record: OrderforTableCell, index: number) => {
      if (record.id === id) {
        this.records.splice(index, 1);
      }
    });
  }
  createOrderTableCellFromOrderEntity(order: Order): OrderforTableCell {
    const dateString = new Date(order.date).toLocaleDateString();
    const orderTableCell: OrderforTableCell = {
      businessPartnerCode: order.businessPartner.code,
      businessPartnerFulname: order.businessPartner.fulName,
      businessPartnerEmail: order.businessPartner.email,
      date: new Date(order.date),
      dateString,
      id: order.id,
      index: order.index,
      orderName: order.orderName,
      orderNumber: order.orderName,
      orderTotalNumber: order.orderTotalNumber,
      orderVersionNumber: order.orderVersionNumber,
      orderVersionRegisterId: order.orderVersionRegister.id,
      businessPartnerCompanyName: order.businessPartner.businesPartnerCompanyName,
      commentToOrderString: order.commentToOrder,
    };
    return orderTableCell;
  }
}
