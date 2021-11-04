using CommonHelpers.Base.Transformer;
using FinancasPessoais.Domain;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Transformers
{
    public class DescricaoExtraTransformer : BaseTransformer<DescricaoExtra, DescricaoExtraModel>
    {
        private ITransformer<dynamic, EntidadeGenericaModel<int>> _entidadeGenericaTransformer;
        private ITransformer<Estabelecimento, EstabelecimentoModel> _estabelecimentoTransformer;

        public DescricaoExtraTransformer(ITransformer<dynamic, EntidadeGenericaModel<int>> entidadeGenericaTransformer,
            ITransformer<Estabelecimento, EstabelecimentoModel> estabelecimentoTransformer)
        {
            _entidadeGenericaTransformer = entidadeGenericaTransformer;
            _estabelecimentoTransformer = estabelecimentoTransformer;
        }

        public override DescricaoExtraModel Transform(DescricaoExtra source)
        {
            var target = base.Transform(source);

            if (target != null)
            {
                target.Classificacao = _entidadeGenericaTransformer.Transform(source.Classificacao);
                //target.Estabelecimento = _estabelecimentoTransformer.Transform(source.Estabelecimento);

                //target.Classificacao = new EntidadeGenericaModel<int>
                //{
                //    Id = source.Classificacao.Id,
                //    Descricao = source.Classificacao.Descricao
                //};
                //target.Estabelecimento = new EntidadeGenericaModel<int>
                //{
                //    Id = source.Estabelecimento.Id,
                //    Descricao = source.Estabelecimento.Descricao
                //};
            }

            return target;
        }

    }
}