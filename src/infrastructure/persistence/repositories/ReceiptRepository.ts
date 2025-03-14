import ReceiptModel, { ReceiptDocument } from "../models/Receipt.model";
import { IReceiptRepository } from "../../../core/application/interfaces/Receipt/IReceiptRepository";
import {
  ProductCompatibility as ProductCompatibilityEntity,
  CarModel as CarModelEntity,
  Receipt,
  User,
  Witness as WitnessEntity,
  Product as ProductEntity,
  Brand,
  Car,
  Customer,
} from "../../../core/domain/entities";
import {
  CreateReceiptDTO,
  UpdateReceiptDTO,
} from "../../../core/application/dtos";
import Witness from "../models/Witness.model";
import ProductCompatibility from "../models/ProductCompatibility.model";
import Product from "../models/Product.model";
import CarModel from "../models/Car.model";
import CarModelModel from "../models/CarModel.model";
import BrandModel from "../models/Brand.model";
import CustomerModel from "../models/Customer.model";
import { Document } from "mongoose";
import { UserRepository } from "./UserRepository";

interface ReceiptDoc extends Document, ReceiptDocument {}

export class ReceiptRepository implements IReceiptRepository {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository(
      process.env.AWS_COGNITO_ID || "",
      process.env.AWS_REGION_COGNITO || "",
    );
  }

  async findById(id: string): Promise<Receipt | null> {
    const receiptDoc = await ReceiptModel.findById(id)
      .populate({
        path: "witnesses",
        model: Witness,
      })
      .populate({
        path: "carId",
        model: CarModel,
        populate: { path: "customerId", model: CustomerModel },
      })
      .populate({
        path: "productInstalled",
        model: ProductCompatibility,
        populate: [
          { path: "product", model: Product },
          {
            path: "carModel",
            model: CarModelModel,
            populate: { path: "brandId", model: BrandModel },
          },
        ],
      })
      .exec();
    if (!receiptDoc) return null;

    const user = await this.userRepository.findById(receiptDoc.cognitoId);

    if (!user) {
      throw new Error("User not found");
    }

    return this.docToEntity(receiptDoc, user);
  }

  async findAll(carId?: string): Promise<Receipt[]> {
    const query = carId ? { carId } : {};
    const receiptDocs = await ReceiptModel.find(query)
      .populate({
        path: "witnesses",
        model: Witness,
      })
      .populate({
        path: "carId",
        model: CarModel,
        populate: { path: "customerId", model: CustomerModel },
      })
      .populate({
        path: "productInstalled",
        model: ProductCompatibility,
        populate: [
          { path: "product", model: Product },
          {
            path: "carModel",
            model: CarModelModel,
            populate: { path: "brandId", model: BrandModel },
          },
        ],
      })
      .exec();
    if (!receiptDocs.length) return [];
    console.log({ receiptDocs });

    const receipts = await Promise.all(
      receiptDocs.map(async (doc) => {
        const user = await this.userRepository.findById(doc.cognitoId);
        if (!user) {
          console.log("no user");
          throw new Error(`User not found for receipt: ${doc._id}`);
        }
        return this.docToEntity(doc, user);
      }),
    );
    console.log({ receipts });
    return receipts;
  }

  async save(dto: CreateReceiptDTO): Promise<Receipt | null> {
    const receiptDoc = new ReceiptModel(dto);
    const savedReceiptDoc = await receiptDoc.save();

    const populatedReceiptDoc = await ReceiptModel.findById(savedReceiptDoc._id)
      .populate({
        path: "witnesses",
        model: Witness,
      })
      .populate({
        path: "carId",
        model: CarModel,
        populate: { path: "customerId", model: CustomerModel },
      })
      .populate({
        path: "productInstalled",
        model: ProductCompatibility,
        populate: [
          { path: "product", model: Product },
          {
            path: "carModel",
            model: CarModelModel,
            populate: { path: "brandId", model: BrandModel },
          },
        ],
      })
      .exec();

    if (!populatedReceiptDoc) {
      return null;
    }

    const user = await this.userRepository.findById(savedReceiptDoc.cognitoId);

    if (!user) {
      throw new Error("User not found");
    }

    return this.docToEntity(populatedReceiptDoc, user);
  }

  async update(id: string, dto: UpdateReceiptDTO): Promise<Receipt> {
    const updatedReceiptDoc = await ReceiptModel.findByIdAndUpdate(id, dto, {
      new: true,
    })
      .populate({
        path: "witnesses",
        model: Witness,
      })
      .populate({
        path: "carId",
        model: CarModel,
        populate: { path: "customerId", model: CustomerModel },
      })
      .populate({
        path: "productInstalled",
        model: ProductCompatibility,
        populate: [
          { path: "product", model: Product },
          {
            path: "carModel",
            model: CarModelModel,
            populate: { path: "brandId", model: BrandModel },
          },
        ],
      })
      .exec();

    if (!updatedReceiptDoc) throw new Error("Receipt not found");

    const user = await this.userRepository.findById(
      updatedReceiptDoc.cognitoId,
    );

    if (!user) {
      throw new Error("User not found");
    }

    return this.docToEntity(updatedReceiptDoc, user);
  }

  async deleteById(id: string): Promise<void> {
    await ReceiptModel.findByIdAndDelete(id).exec();
  }

  private docToEntity(doc: ReceiptDoc, user: User): Receipt {
    const witnesses = doc.witnesses.map(
      (witness: WitnessEntity) =>
        new WitnessEntity(
          witness.name,
          witness.description,
          witness._id?.toString(),
        ),
    );

    const productsInstalled = doc.productInstalled.map((productInstalled) => {
      const brand = new Brand(
        productInstalled.carModel.brandId.name,
        productInstalled.carModel.brandId.description,
        productInstalled.carModel.brandId._id?.toString(),
      );

      const carModel = new CarModelEntity(
        productInstalled.carModel.name,
        brand,
        productInstalled.carModel.year,
        productInstalled.carModel.engineSize,
        productInstalled.carModel.cylinder,
        productInstalled.carModel.combustion,
        productInstalled.carModel.engineType,
        productInstalled.carModel.files,
        productInstalled._id?.toString(),
      );

      const product = new ProductEntity(
        productInstalled.product.name,
        productInstalled.product.description,
        productInstalled.product._id?.toString(),
      );

      const productCompatibility = new ProductCompatibilityEntity(
        product,
        carModel,
        productInstalled._id?.toString(),
      );

      return productCompatibility;
    });

    const customer = new Customer(
      doc.carId.customerId.name,
      doc.carId.customerId.lastName,
      doc.carId.customerId.city,
      doc.carId.customerId.state,
      doc.carId.customerId.country,
      doc.carId.customerId.phone,
      doc.carId.customerId.email,
      doc.carId.customerId.rfc,
      doc.carId.customerId.razonSocial,
      doc.carId.customerId.contacto,
      doc.carId.customerId.companyId,
      doc.carId.customerId._id?.toString(),
    );

    const car = new Car(
      doc.carId.vin,
      doc.carId.plates,
      doc.carId.carModelId,
      customer,
      undefined,
      undefined,
      doc.carId._id?.toString(),
    );

    const receipt = new Receipt(
      doc.signImage,
      doc.installationStatus,
      doc.tankStatus,
      doc.mileage,
      doc.damageImages,
      doc.scannerDescriptionImages,
      user,
      car,
      doc.installationEndDate,
      doc.damageStatusDescription,
      doc.scannerDescription,
      witnesses,
      productsInstalled,
      doc._id?.toString(),
    );

    return receipt;
  }
}
