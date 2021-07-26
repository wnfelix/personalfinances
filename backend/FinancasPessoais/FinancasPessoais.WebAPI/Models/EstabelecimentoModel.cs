using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Models
{
    public class EstabelecimentoModel
    {
        public int Id { get; set; }
        public string PalavraChave { get; set; }
        public string Descricao { get; set; }
        public EntidadeGenericaModel<int> Classificacao { get; set; }
        public int LancamentosTotal { get; internal set; }
        public int DescricoesExtrasTotal { get; internal set; }
    }
}