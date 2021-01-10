using CommonHelpers.Base;
using CommonHelpers.Enumerations;
using FinancasPessoais.Data;
using NHibernate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Console.Sessions
{
    public class FinancasPessoaisSession : IFinancasPessoaisSession
    {
        public ISession GetSession()
        {
            return DatabaseContext.GetSessionFactoryInstance(ConnectionStringEnum.FinancasPessoais).OpenSession();
        }

        public IStatelessSession GetStatelessSession()
        {
            return DatabaseContext.GetSessionFactoryInstance(ConnectionStringEnum.FinancasPessoais).OpenStatelessSession();
        }
    }
}
