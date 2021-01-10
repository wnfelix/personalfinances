using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services.Validators
{
    public interface IValidator<T>
    {
        Dictionary<int, string> Validate(T entity, params object[] parameters);

        string BuildValidationMessage();

        string BuildValidationMessage(Dictionary<int, string> errors);
    }
}
