using CommonHelpers.Base;
using FinancasPessoais.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinancasPessoais.Data.Repositories
{
    public class DominioRepository : BaseRepository<Dominio, int>, IDominioRepository
    {
        public DominioRepository(IFinancasPessoaisSession session) : base(session.GetSession())
        {

        }
    }
}
