using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services.Validators
{
    public abstract class BaseValidator<T> : IValidator<T>
    {
        protected Dictionary<int, string> _report;

        public BaseValidator()
        {
            _report = new Dictionary<int, string>();
        }

        public abstract Dictionary<int, string> Validate(T entity, params object[] parameters);

        public virtual string BuildValidationMessage()
        {
            return BuildValidationMessage(_report);
        }

        public virtual string BuildValidationMessage(Dictionary<int, string> errors)
        {
            var message = new StringBuilder();

            Array.ForEach(errors.ToArray(), item => message.AppendLine($"{item.Key.ToString()} - {item.Value}"));

            return message.ToString();
        }
    }
}
