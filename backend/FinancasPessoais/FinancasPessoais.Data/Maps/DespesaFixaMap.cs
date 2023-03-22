using FinancasPessoais.Domain;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Data.Maps
{
    public class DespesaFixaMap : ClassMap<DespesaFixa>
    {
        public DespesaFixaMap()
        {
            Id(x => x.Id);
            Map(x => x.Descricao);
            Map(x => x.CriadoEm);
            Map(x => x.Ativo);
            Map(x => x.Valor);
            References(x => x.Classificacao, "IdClassificacao");
        }
    }
}
