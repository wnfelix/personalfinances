using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services.Helper
{
    public class CSVFile
    {
        private StringBuilder _sbRows;
        private StringBuilder _sbTotal;

        public CSVFile()
        {
            _sbRows = new StringBuilder();
            _sbTotal = new StringBuilder();

            _sbRows.AppendLine("Data;Local;Valor");
        }

        public virtual void AppendLine(DebitoData data)
        {
            //_sbRows.AppendLine($"{data.Data.ToString("dd/MM")};{data.Local};{data.Valor};;{string.Concat(data.Data.ToString("dd/MM"), " ", data.Local, "=", data.Valor.ToString("0.00"))}");
            _sbRows.AppendLine($"{data.Data.ToString("dd/MM")};{data.Local};{data.Valor};;{string.Concat(data.Data.ToString("dd/MM"), " ", data.Local, "=", data.Valor)}");
            _sbTotal.Append(string.Concat("+", data.Valor));
        }

        public virtual void Save(string filePath)
        {
            var tmpSb = new StringBuilder(_sbRows.ToString());
            tmpSb.AppendLine($"Total;;{string.Concat("=", _sbTotal.ToString().Substring(1))}");

            File.WriteAllText(filePath, tmpSb.ToString());
        }
    }
}
