using Microsoft.Data.SqlClient;
using System.Data;

namespace BlazorApp1.Conexion
{
    public class ProductRepository
    {
        private readonly DbConnection _dbConnection;

        public ProductRepository(DbConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<DataTable> GetProductsByStockAsync(int minStock)
        {
            // Ejemplo de uso para una consulta SQL
            string query = "SELECT nombre_producto, stock FROM prog.tabla_test WHERE stock > @minStock";

            var parameters = new SqlParameter[]
            {
            new SqlParameter("@minStock", SqlDbType.Int) { Value = minStock }
            };

            return await _dbConnection.ExecuteQueryAsync(query, parameters);
        }

        public async Task<DataTable> GetProductsFromStoredProcedureAsync(string spName, int productId)
        {
            // Ejemplo de uso para un procedimiento almacenado
            // (Asume que tienes un SP llamado "GetProductById")
            var parameters = new SqlParameter[]
            {
            new SqlParameter("@ProductId", SqlDbType.Int) { Value = productId }
            };

            return await _dbConnection.ExecuteStoredProcedureAsync(spName, parameters);
        }
    }
}
