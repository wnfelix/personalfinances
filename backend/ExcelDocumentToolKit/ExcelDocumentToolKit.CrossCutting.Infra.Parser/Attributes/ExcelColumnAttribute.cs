using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExcelDocumentToolKit.CrossCutting.Infra.Attributes
{
    /// <summary>
    /// Atributo para decorar propriedades de classes e informar o título da coluna ou índice de leitura
    /// </summary>
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class ExcelColumnAttribute
        : Attribute
    {
        /// <summary>
        /// Título da coluna
        /// </summary>
        public string ColumnTitle;

        /// <summary>
        /// Índice da coluna (zero based)
        /// </summary>
        public int ColumnIndex = -1;
    }
}
