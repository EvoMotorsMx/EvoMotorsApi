import { Document } from "mongoose";
import CustomerModel, { CustomerDocument } from "../models/Customer.model";
import { ICustomerRepository } from "../../../core/application/interfaces/Customer";
import { Customer } from "../../../core/domain/entities";
import {
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "../../../core/application/dtos";

interface CustomerDoc extends Document, CustomerDocument {}

export class CustomerRepository implements ICustomerRepository {
  async findById(id: string): Promise<Customer | null> {
    const customerDoc = await CustomerModel.findById(id).exec();
    if (!customerDoc) return null;
    return this.docToEntity(customerDoc);
  }

  async findAll(): Promise<Customer[]> {
    const customerDocs = await CustomerModel.find().exec();
    if (!customerDocs.length) return [];
    return customerDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Customer
  }

  async save(dto: CreateCustomerDTO): Promise<Customer> {
    const customerDoc = new CustomerModel(dto);
    const savedCustomerDoc = await customerDoc.save();
    return this.docToEntity(savedCustomerDoc);
  }

  async update(id: string, dto: UpdateCustomerDTO): Promise<Customer> {
    const updatedCustomerDoc = await CustomerModel.findByIdAndUpdate(id, dto, {
      new: true,
    }).exec();
    if (!updatedCustomerDoc) throw new Error("Customer not found");
    return this.docToEntity(updatedCustomerDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CustomerModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CustomerDoc): Customer {
    const customer = new Customer(
      doc.name,
      doc.lastName,
      doc.city,
      doc.state,
      doc.country,
      doc.phone,
      doc.email,
      doc.rfc,
      doc.razonSocial,
      doc.contacto,
      [],
      [],
      doc._id?.toString(),
    );
    return customer;
  }
}
