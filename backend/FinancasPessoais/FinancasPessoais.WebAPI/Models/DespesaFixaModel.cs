using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Models
{
    public class DespesaFixaModel
    {
        public int Id { get; set; }
        public decimal Valor { get; set; }
        public string Descricao { get; set; }
        public dynamic Classificacao { get; set; }
    }
}