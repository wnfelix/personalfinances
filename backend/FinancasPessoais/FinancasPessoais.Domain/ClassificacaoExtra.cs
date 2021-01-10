using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Domain
{
    public class ClassificacaoExtra : BaseDomain<int>
    {
        public virtual TipoDominio Classificacao { get; set; }
        public virtual DateTime DataInicio { get; set; }
        public virtual DateTime DataFim { get; set; }
        public virtual string Prefixo { get; set; }
    }
}
