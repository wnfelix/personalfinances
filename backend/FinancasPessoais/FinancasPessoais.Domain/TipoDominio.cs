using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Domain
{
    public class TipoDominio : BaseDomain<int>
    {
        public virtual string Descricao { get; set; }
        public virtual Dominio Dominio { get; set; }
        public virtual bool Ativo { get; set; }
        public virtual decimal Ordem { get; set; }
    }
}
