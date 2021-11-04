using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Models
{
    public class LancamentoModel
    {
        public int Id { get; set; }
        public decimal Valor { get; set; }
        public string Descricao { get; set; }
        public dynamic Estabelecimento { get; set; }
        public dynamic DescricaoExtra { get; set; }
        public dynamic ClassificacaoExtra { get; set; }
        public DateTime DtReferencia { get; set; }
        public DateTime DtCompra { get; set; }
    }
}