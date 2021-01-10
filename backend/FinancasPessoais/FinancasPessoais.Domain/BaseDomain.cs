using System;
using System.Collections.Generic;
using System.Text;

namespace FinancasPessoais.Domain
{
    public abstract class BaseDomain<TKey> where TKey : struct
    {
        public virtual TKey Id { get; set; }
    }
}
