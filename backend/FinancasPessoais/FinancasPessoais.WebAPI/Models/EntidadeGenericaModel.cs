using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Models
{
    public class EntidadeGenericaModel<TId>
    {
        public TId Id { get; set; }
        public string Descricao { get; set; }
    }
}