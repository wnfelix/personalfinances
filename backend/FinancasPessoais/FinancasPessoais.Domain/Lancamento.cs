using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Domain
{
    public class Lancamento : BaseDomain<int>
    {
        public virtual DateTime DtCompra { get; set; }
        public virtual DateTime DtReferencia { get; set; }
        public virtual decimal Valor { get; set; }
        public virtual string Descricao { get; set; }
        public virtual Estabelecimento Estabelecimento { get; set; }
        public virtual DescricaoExtra DescricaoExtra { get; set; }
        public virtual ClassificacaoExtra ClassificacaoExtra { get; set; }
        public virtual DateTime CriadoEm { get; set; }
    }
}
