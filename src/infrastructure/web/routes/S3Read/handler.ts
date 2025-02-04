import { S3 } from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { PDFDocument } from "pdf-lib";

const s3 = new S3();

export const handler: APIGatewayProxyHandler = async (event) => {
  const bucketName = process.env.BUCKET_NAME;
  const { pdfDirectory } = JSON.parse(event.body || "{}");

  try {
    // Leer el archivo PDF desde S3
    const params = {
      Bucket: bucketName!,
      Key: pdfDirectory,
    };

    const data = await s3.getObject(params).promise();
    const pdfDoc = await PDFDocument.load(data.Body as Uint8Array);

    const pdfBytes = await pdfDoc.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "PDF leído con éxito",
        pdf: Buffer.from(pdfBytes).toString("base64"),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error al leer el PDF",
        error: (error as Error).message,
      }),
    };
  }
};
