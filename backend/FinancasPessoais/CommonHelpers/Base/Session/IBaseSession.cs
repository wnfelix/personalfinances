using NHibernate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonHelpers.Base
{
    public interface IBaseSession
    {
        ISession GetSession();

        IStatelessSession GetStatelessSession();
    }
}
