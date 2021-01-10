using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Models
{
    public class TipoDominioModel
    {
        public int Id { get; set; }
        public string Descricao { get; set; }
        public EntidadeGenericaModel<int> Dominio { get; set; }
    }
}