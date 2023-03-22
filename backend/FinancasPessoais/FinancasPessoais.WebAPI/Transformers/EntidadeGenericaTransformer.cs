using CommonHelpers.Base.Transformer;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Transformers
{
    public class EntidadeGenericaTransformer : BaseTransformer<dynamic, EntidadeGenericaModel<int>>
    {
        public new EntidadeGenericaModel<int> Transform(dynamic source) =>
            new EntidadeGenericaModel<int> { Id = source.Id, Descricao = source.Descricao };

    }
}