using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Models
{
    public class ClassificacaoExtraModel
    {
        public int Id { get; set; }
        public TipoDominioModel Classificacao { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public string Prefixo { get; set; }
    }
}