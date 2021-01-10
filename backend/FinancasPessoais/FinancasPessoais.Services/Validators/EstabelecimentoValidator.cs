using FinancasPessoais.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services.Validators
{
    public class EstabelecimentoValidator : BaseValidator<Estabelecimento>, IEstabelecimentoValidator
    {
        public override Dictionary<int, string> Validate(Estabelecimento entity, params object[] parameters)
        {
            throw new NotImplementedException();
        }
    }
}
