import { Injectable } from '@angular/core';
import ProductType from '../../../Products/ProductTypesAndClasses/productType.entity';
import ProductBottom from '../../../Products/ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../../Products/ProductTypesAndClasses/productTop.entity';
import {DrawingPaths} from '../../../Products/ProductTypesAndClasses/drawingPaths';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {take, tap} from 'rxjs/operators';
import User from '../../../Users/users/userTypes/user';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import {CreateOrderDto} from '../../OrdersTypesAndClasses/orderDto';
import OrderVersionRegister from '../../OrdersTypesAndClasses/orderVersionRegister';
import {OrderTableService} from './order-table.service';
import {Material} from '../../../materials/MaterialsMainComponent/material';
import Product from '../../../Products/ProductTypesAndClasses/product.entity';
import NewestOrderNumber from '../../OrdersTypesAndClasses/newestOrderNumber';
import {API_URL} from '../../../Config/apiUrl';
import OrderforTableCell from '../../OrdersTypesAndClasses/orderforTableCell';

@Injectable({
  providedIn: 'root'
})
export class OrderBackendService {
  rootURL = API_URL ;
  endpointUrl = '/orders';
  selectedProduct: Product;
  selectedParnter: User;
  selectedMaterial: Material;
  logedUser: User;
  createOrderDtoForConfirmUpdateShowDrawing: CreateOrderDto;
  constructor(private http: HttpClient,
              private tableService: OrderTableService) {
  }

  getCurrentOrdersForPrivilligedUsers(): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(`${this.rootURL + this.endpointUrl}/currents`, {observe: 'response'}).pipe(take(1));
  }
  getCurrentOrdersForPartners(partnerCode: string): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(`${this.rootURL + this.endpointUrl}/currents/businessPartner/${partnerCode}`, {observe: 'response'});
  }
  getNewOrderNumber(): Observable<HttpResponse<NewestOrderNumber>> {
    return this.http.get<NewestOrderNumber>(`${this.rootURL + this.endpointUrl}/orderNumber/newest`, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: CreateOrderDto): Observable<HttpResponse<Order>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Order>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(this.createOrderTableCellFromOrderEntity(record.body));
      }));
  }

  deleteOrderWithVersionRegisterByCurrentId(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL + this.endpointUrl}/currents/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.tableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, updatedRecord: CreateOrderDto): Observable<HttpResponse<Order>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/currents/${id}/newVersion`;
    return this.http.post<Order>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable

      tap((record) => {
        const recordbody = record.body;
        this.tableService.updateTableRecord(Number(id), this.createOrderTableCellFromOrderEntity(record.body));
      }));
  }
  findRecordById(id: string): Observable<HttpResponse<Order>>{
    const getUrl = `${this.rootURL + this.endpointUrl}/${id}`;
    return this.http.get<Order>(getUrl, {observe: 'response'} );
  }
  findOrderVersionRegisterById(id: string): Observable<HttpResponse<OrderVersionRegister>> {
    const getUrl = `${this.rootURL + this.endpointUrl}/orderVersionRegister/${id}`;
    return this.http.get<OrderVersionRegister>(getUrl, {observe: 'response'} );
  }
  getDrawingPdf(selectedDrawingUrl: string): Observable<any> {
    const getUrl = `${this.rootURL + this.endpointUrl}/drawing/save/pdf`;
    return this.http.post(getUrl, {url: selectedDrawingUrl},{responseType: 'blob'} );
  }
  getCreateOrderDtoFromOrder(order: Order): CreateOrderDto {
    const createOrderDto: CreateOrderDto = {
      product: order.product,
      orderTotalNumber: order.orderTotalNumber,
      orderNumber: order.orderNumber,
      orderDetails: order.orderDetails,
      orderName: order.orderName,
      orderVersionNumber: order.orderVersionNumber,
      commentToOrder: order.commentToOrder,
      date: order.date,
      businessPartner: order.businessPartner,
      creator: order.creator,
      index: order.index,
      productMaterial: order.productMaterial
    };
    return createOrderDto;
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
