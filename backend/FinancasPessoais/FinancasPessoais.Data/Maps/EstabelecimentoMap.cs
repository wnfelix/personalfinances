using FinancasPessoais.Domain;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Data.Maps
{
    public class EstabelecimentoMap : ClassMap<Estabelecimento>
    {
        public EstabelecimentoMap()
        {
            Id(x => x.Id).GeneratedBy.Identity().Precision(1);
            Map(x => x.PalavraChave);
            Map(x => x.Descricao);
            Map(x => x.Ativo);
            References(x => x.Classificacao, "IdClassificacao");
        }
    }
}
