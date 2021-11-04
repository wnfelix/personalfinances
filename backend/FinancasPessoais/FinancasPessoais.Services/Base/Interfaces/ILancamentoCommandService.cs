using FinancasPessoais.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services
{
    public interface ILancamentoCommandService
    {
        string ExportExcel(string[] filePathSource, DateTime dtRef);
        List<Lancamento> Lancamentos(DateTime mesref);
    }
}
