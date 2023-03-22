using ExcelDocumentToolKit.CrossCutting.Infra.Attributes;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services.Helper
{
    [DebuggerDisplay("Local={Local}")]
    public class DebitoData
    {
        [ExcelColumn(ColumnIndex = 0)]
        public DateTime Data { get; set; }

        [ExcelColumn(ColumnIndex = 1)]
        public string Local { get; set; }

        [ExcelColumn(ColumnIndex = 2)]
        public decimal Valor { get; set; }

        [ExcelColumn(ColumnIndex = 3)]
        public string Separador { get { return "-"; } }

        [ExcelColumn(ColumnIndex = 4)]
        public string Totais { get { return string.Concat(Data.ToString("dd/MM"), " ", Local, " = ", Valor); } }
    }
}
