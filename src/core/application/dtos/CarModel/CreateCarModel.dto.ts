import { CombustionType, EngineType } from "../../../../shared/enums";

export type CreateCarModelDTO = {
  name: string; // Nombre del modelo del auto
  brandId: string; // ID de la marca asociada
  year: string[]; // Años del modelo (puede ser un rango o lista de años específicos)
  engineSize: string; // Tamaño del motor (e.g., "2.0L")
  cylinder: number; // Número de cilindros
  combustion: CombustionType; // Tipo de combustión (e.g., gasolina, diésel)
  engineType: EngineType; // Tipo de motor (e.g., eléctrico, híbrido)
  originalHp: number; // Potencia original del motor (en caballos de fuerza)
  originalTorque: number; // Torque original del motor (en Nm o lb-ft)
  topSpeed?: number; // Velocidad máxima (opcional)
  files?: string[]; // Archivos relacionados (e.g., imágenes o documentos)
  isActive?: boolean; // Indica si el modelo está activo o no (opcional, por defecto true)
};
