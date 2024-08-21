import { Document } from "mongoose";
import CompanyModel, { CompanyDocument } from "../models/Company.model";
import { ICompanyRepository } from "../../../core/application/interfaces";
import { Company } from "../../../core/domain/entities";

interface CompanyDoc extends Document, CompanyDocument {}

export class CompanyRepository implements ICompanyRepository {
  async findById(id: string): Promise<Company | null> {
    const companyDoc = await CompanyModel.findById(id).exec();
    if (!companyDoc) return null;
    return this.docToEntity(companyDoc);
  }

  async findAll(): Promise<Company[]> {
    const companyDocs = await CompanyModel.find().exec();
    if (!companyDocs.length) return [];
    return companyDocs.map((doc) => this.docToEntity(doc)); // Convertir cada documento a una entidad Company
  }

  async save(company: Company): Promise<Company> {
    const companyDoc = new CompanyModel({
      name: company.name,
      city: company.city,
      state: company.state,
      country: company.country,
      phone: company.state,
      email: company.email,
      users: company.users,
    });
    const savedCompanyDoc = await companyDoc.save();
    return this.docToEntity(savedCompanyDoc);
  }

  async update(id: string, company: Company): Promise<Company> {
    const updatedCompanyDoc = await CompanyModel.findByIdAndUpdate(
      id,
      {
        name: company.name,
        city: company.city,
        state: company.state,
        country: company.country,
        phone: company.state,
        email: company.email,
        users: company.users,
      },
      { new: true },
    ).exec();
    if (!updatedCompanyDoc) throw new Error("Company not found");
    return this.docToEntity(updatedCompanyDoc);
  }

  async deleteById(id: string): Promise<void> {
    await CompanyModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: CompanyDoc): Company {
    const company = new Company(
      doc.name,
      doc.city,
      doc.state,
      doc.country,
      doc.phone,
      doc.email,
      doc.users,
      doc._id as string,
    );

    return company;
  }
}
