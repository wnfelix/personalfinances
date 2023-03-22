using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Domain
{
    public class DespesaFixa : BaseDomain<int>
    {
        public virtual string Descricao { get; set; }
        public virtual decimal Valor { get; set; }
        public virtual bool Ativo { get; set; }
        public virtual DateTime CriadoEm { get; set; }
        public virtual TipoDominio Classificacao { get; set; }
    }
}
