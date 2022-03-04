using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonHelpers.Constants
{
    public sealed class GeneralConstants
    {
        /// <summary>
        /// Tipos primitivos do framework utilizado para reflection
        /// </summary>
        public readonly string[] PrimitiveTypes = { "DECIMAL", "GUID", "DATETIME", "STRING", "BOOLEAN", "BYTE", "SBYTE", "INT16", "UINT16", "INT32", "UINT32", "INT64", "UINT64", "INTPTR", "UINTPTR", "CHAR", "DOUBLE", "SINGLE" };

        public const string DEFAULT_UNKNOWITEM_LABEL = "DESCONHECIDO";
    }
}
