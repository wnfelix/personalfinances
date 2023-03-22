using FinancasPessoais.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Data.Repositories
{
    public interface IDominioRepository : IRepository<Dominio, int>
    {
        void ApagarLancamentosPorDtRef(DateTime dtRef);
    }
}
