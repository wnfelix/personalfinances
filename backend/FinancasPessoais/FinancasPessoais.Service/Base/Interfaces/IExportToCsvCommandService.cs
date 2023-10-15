using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services
{
    public interface IExportToCsvCommandService
    {
        void ExportExcel(string filePath);
    }
}
