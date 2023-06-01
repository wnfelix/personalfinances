using CommonHelpers.Constants;
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
        public virtual TipoDominio Classificacao { get; set; }
        public virtual DateTime CriadoEm { get; set; }
        public virtual bool Manual { get; set; }

        public virtual TipoDominio GetClassificacaoFinal()
        {
            if (DescricaoExtra != null)
            {
                return DescricaoExtra.Classificacao;
            }
            else if (ClassificacaoExtra != null)
            {
                return ClassificacaoExtra.Classificacao;
            }
            else if (Estabelecimento?.Id > 0)
            {
                return Estabelecimento.Classificacao;
            }
            else if (Manual && Classificacao != null)
            {
                return Classificacao;
            }
            else if (Estabelecimento == null)
            {
                return new TipoDominio { Id = 0, Descricao = GeneralConstants.DEFAULT_UNKNOWITEM_LABEL, Ordem = 0 };
            }
            else
            {
                return Estabelecimento.Classificacao;
            }
        }
    }
}
