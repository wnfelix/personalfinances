using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services
{
    public interface IExportToExcelCommandService
    {
        void ExportExcel(string filePathSource, string filePathTarget, DateTime dtRef);
        void ExportExcel(string filePathSource, string filePathTarget, string fileFromToPath);
    }
}
