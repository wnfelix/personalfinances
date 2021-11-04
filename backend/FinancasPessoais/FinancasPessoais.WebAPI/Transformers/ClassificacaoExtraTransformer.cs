using CommonHelpers.Base.Transformer;
using FinancasPessoais.Domain;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Transformers
{
    public class ClassificacaoExtraTransformer : BaseTransformer<ClassificacaoExtra, ClassificacaoExtraModel>
    {
        private ITransformer<TipoDominio, TipoDominioModel> _classificacaoTransformer;

        public ClassificacaoExtraTransformer(ITransformer<TipoDominio, TipoDominioModel> classificacaoTransformer)
        {
            _classificacaoTransformer = classificacaoTransformer;
        }

        public override ClassificacaoExtraModel Transform(ClassificacaoExtra source)
        {
            var target = base.Transform(source);

            if (source?.Classificacao != null)
                target.Classificacao = _classificacaoTransformer.Transform(source.Classificacao);

            return target;
        }
    }
}