using CommonHelpers.Base.Transformer;
using FinancasPessoais.Domain;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Transformers
{
    public class DespesaFixaTransformer : BaseTransformer<DespesaFixa, DespesaFixaModel>
    {
        private ITransformer<dynamic, EntidadeGenericaModel<int>> _entidadeGenericaTransformer;

        public DespesaFixaTransformer(ITransformer<dynamic, EntidadeGenericaModel<int>> entidadeGenericaTransformer)
        {
            _entidadeGenericaTransformer = entidadeGenericaTransformer;
        }

        public override DespesaFixaModel Transform(DespesaFixa source)
        {
            var df = base.Transform(source);

            df.Classificacao = _entidadeGenericaTransformer.Transform(source.Classificacao);

            return df;
        }
    }
}