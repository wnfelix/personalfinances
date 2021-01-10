using CommonHelpers.Base.Transformer;
using FinancasPessoais.Domain;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Transformers
{
    public class EstabelecimentoTransformer : BaseTransformer<Estabelecimento, EstabelecimentoModel>
    {
        public override Estabelecimento Reverse(EstabelecimentoModel source)
        {
            var target = base.Reverse(source);

            target.Classificacao = new TipoDominio { Id = source.Classificacao.Id };
            target.Ativo = true;

            return target;
        }

        public override EstabelecimentoModel Transform(Estabelecimento source)
        {
            var target = base.Transform(source);

            target.Classificacao = new EntidadeGenericaModel<int> { Id = source.Classificacao.Id, Descricao = source.Classificacao.Descricao };

            return target;
        }
    }
}