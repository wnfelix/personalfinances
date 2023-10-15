using FinancasPessoais.Domain;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Data.Maps
{
    public class TipoDominioMap : ClassMap<TipoDominio>
    {
        public TipoDominioMap()
        {
            Table("Tipo_Dominio");
            Id(x => x.Id).GeneratedBy.GetGeneratorMapping();
            Map(x => x.Descricao);
            Map(x => x.Ativo);
            Map(x => x.Ordem);
            References(x => x.Dominio, "IdDominio");
        }
    }
}
