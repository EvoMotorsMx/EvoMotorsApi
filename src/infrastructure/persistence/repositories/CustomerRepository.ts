import { Document } from "mongoose";
import CustomerModel, { CustomerDocument } from "../models/Customer.model";
import RemissionModel from "../models/Remission.model";
import { ICustomerRepository } from "../../../core/application/interfaces/Customer";
import CompanyModel from "../models/Company.model";
import { Customer, Company } from "../../../core/domain/entities";
import {
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from "../../../core/application/dtos";

interface CustomerDoc extends Document, CustomerDocument {}

export class CustomerRepository implements ICustomerRepository {
  async findById(id: string): Promise<Customer | null> {
    const customerDoc = await CustomerModel.findById(id)
      .populate({
        path: "company",
        model: CompanyModel,
      })
      .exec();
    if (!customerDoc) return null;

    return this.docToEntity(customerDoc);
  }

  async findAll(): Promise<Customer[]> {
    let customerDocs = await CustomerModel.find()
      .populate({
        path: "company",
        model: CompanyModel,
      })
      .exec();
    if (!customerDocs.length) return [];

    return customerDocs.map((doc) => this.docToEntity(doc));
  }

  async save(dto: CreateCustomerDTO): Promise<Customer> {
    const customerDoc = new CustomerModel(dto);
    const savedCustomerDoc = await customerDoc.save();
    const populatedCustomerDoc = await CustomerModel.findById(
      savedCustomerDoc._id,
    )
      .populate({
        path: "company",
        model: CompanyModel,
      })
      .exec();
    if (!populatedCustomerDoc) throw new Error("Customer not found");

    return this.docToEntity(populatedCustomerDoc);
  }

  async update(id: string, dto: UpdateCustomerDTO): Promise<Customer> {
    const updatedCustomerDoc = await CustomerModel.findByIdAndUpdate(id, dto, {
      new: true,
    })
      .populate({
        path: "company",
        model: CompanyModel,
      })
      .exec();
    if (!updatedCustomerDoc) throw new Error("Customer not found");

    return this.docToEntity(updatedCustomerDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CustomerModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CustomerDoc): Customer {
    const company = new Company(
      doc.company.name,
      doc.company.city,
      doc.company.state,
      doc.company.country,
      doc.company.phone,
      doc.company.email,
      [],
      doc.company._id?.toString(),
    );

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
      company,
      doc._id?.toString(),
    );

    return customer;
  }
}
