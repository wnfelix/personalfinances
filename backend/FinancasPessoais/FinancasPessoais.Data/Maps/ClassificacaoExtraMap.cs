using FinancasPessoais.Domain;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Data.Maps
{
    public class ClassificacaoExtraMap : ClassMap<ClassificacaoExtra>
    {
        public ClassificacaoExtraMap()
        {
            Id(x => x.Id).GeneratedBy.Identity();
            Map(x => x.DataFim);
            Map(x => x.DataInicio);
            Map(x => x.Prefixo);
            References(x => x.Classificacao, "IdClassificacao");
        }
    }
}
