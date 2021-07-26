using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Domain
{
    [DebuggerDisplay("Key={PalavraChave}")]
    public class Estabelecimento : BaseDomain<int>
    {
        public virtual string PalavraChave { get; set; }
        public virtual string Descricao { get; set; }
        public virtual TipoDominio Classificacao { get; set; }
        public virtual bool Ativo { get; set; }
        public virtual IList<Lancamento> Lancamentos { get; set; }
    }
}
