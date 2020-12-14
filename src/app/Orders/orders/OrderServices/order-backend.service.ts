import { Injectable } from '@angular/core';
import ProductType from '../../../Products/ProductTypesAndClasses/productType.entity';
import ProductBottom from '../../../Products/ProductTypesAndClasses/productBottom.entity';
import ProductTop from '../../../Products/ProductTypesAndClasses/productTop.entity';
import {DrawingPaths} from '../../../Products/ProductTypesAndClasses/drawingPaths';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import User from '../../../Users/users/userTypes/user';
import Order from '../../OrdersTypesAndClasses/orderEntity';
import {CreateOrderDto} from '../../OrdersTypesAndClasses/orderDto';
import OrderVersionRegister from '../../OrdersTypesAndClasses/orderVersionRegister';
import {OrderTableService} from './order-table.service';

@Injectable({
  providedIn: 'root'
})
export class OrderBackendService {
  rootURL = 'http://localhost:5000';
  endpointUrl = '/orders';
  selectedType: ProductType;
  selectedBottom: ProductBottom;
  selectedTop: ProductTop;
  drawingPaths: DrawingPaths;
  selectedParnter: User;
  logedUser: User;
  constructor(private http: HttpClient,
              private tableService: OrderTableService) {
  }

  getCurrentOrdersForPrivilligedUsers(): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(`${this.rootURL + this.endpointUrl}/currents`, {observe: 'response'});
  }
  getCurrentOrdersForPartners(partnerCode: string): Observable<HttpResponse<Order[]>> {
    return this.http.get<Order[]>(`${this.rootURL + this.endpointUrl}/currents/businessPartner/${partnerCode}`, {observe: 'response'});
  }

  // tslint:disable-next-line:typedef
  addRecords(record: CreateOrderDto): Observable<HttpResponse<Order>> {
    // tslint:disable-next-line:max-line-length
    return this.http.post<Order>(this.rootURL + this.endpointUrl, record, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.addRecordToTable(this.tableService.createOrderTableCellFromOrderEntity(record.body));
      }));
  }

  deleteRecordById(id: string): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.rootURL + this.endpointUrl}/currents/${id}`;
    return this.http.delete(deleteUrl, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((material) => {
        this.tableService.deleteRecordById(Number(id));
      }));
  }

  updateRecordById(id: string, updatedRecord: CreateOrderDto): Observable<HttpResponse<Order>> {
    const updateUrl = `${this.rootURL + this.endpointUrl}/currents/${id}/newVersion`;
    return this.http.patch<Order>(updateUrl, updatedRecord, {observe: 'response'}).pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap((record) => {
        this.tableService.updateTableRecord(Number(id), this.tableService.createOrderTableCellFromOrderEntity(record.body));
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

}
