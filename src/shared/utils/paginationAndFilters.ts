export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Aplica paginación y filtros a una consulta.
 * @param query - La consulta base (puede ser un ORM o una consulta directa).
 * @param pagination - Parámetros de paginación (page y limit).
 * @param filters - Filtros a aplicar.
 * @returns La consulta modificada con paginación y filtros.
 */
export async function applyPaginationAndFilters<T>(
  query: any, // Puede ser un ORM como Mongoose, Sequelize, TypeORM, etc.
  pagination: PaginationParams,
  filters: FilterParams,
): Promise<{ data: T[]; total: number }> {
  const { page, limit } = pagination;

  // Aplicar filtros
  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined) {
      query = query.where(key, filters[key]); // Ajusta según tu ORM o base de datos
    }
  });

  // Obtener el total de registros antes de la paginación
  const total = await query.clone().count(); // Clona la consulta para contar sin paginar

  // Aplicar paginación
  const offset = (page - 1) * limit;
  const data = await query.limit(limit).offset(offset); // Ajusta según tu ORM

  return { data, total };
}
