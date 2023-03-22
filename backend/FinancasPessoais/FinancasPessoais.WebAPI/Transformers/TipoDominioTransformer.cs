using CommonHelpers.Base.Transformer;
using FinancasPessoais.Domain;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Transformers
{
    public class TipoDominioTransformer : BaseTransformer<TipoDominio, TipoDominioModel>
    {
        public override TipoDominioModel Transform(TipoDominio source)
        {
            var target = base.Transform(source);

            if (target != null)
                target.Dominio = new EntidadeGenericaModel<int>
                {
                    Id = source.Dominio.Id,
                    Descricao = source.Dominio.Descricao
                };

            return target;
        }

        public override TipoDominio Reverse(TipoDominioModel source)
        {
            var target = base.Reverse(source);

            if (target != null)
                target.Dominio = new Dominio { Id = source.Dominio.Id };

            return target;
        }
    }
}