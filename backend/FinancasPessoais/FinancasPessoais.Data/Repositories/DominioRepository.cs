using CommonHelpers.Base;
using FinancasPessoais.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinancasPessoais.Data.Repositories
{
    public class DominioRepository : BaseRepository<Dominio, int>, IDominioRepository
    {
        public DominioRepository(IFinancasPessoaisSession session) : base(session.GetSession(), session.GetStatelessSession())
        {

        }

        public void ApagarLancamentosPorDtRef(DateTime dtRef)
        {
            base.ExecuteSql($"delete from Lancamento where EXTRACT(YEAR_MONTH FROM dtreferencia)='{dtRef.ToString("yyyyMM")}' and manual=0");
        }
    }
}
