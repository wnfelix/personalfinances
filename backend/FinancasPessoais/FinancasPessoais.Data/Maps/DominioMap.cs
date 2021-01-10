using FinancasPessoais.Domain;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Text;

namespace FinancasPessoais.Data.Maps
{
    public class DominioMap : ClassMap<Dominio>
    {
        public DominioMap()
        {
            Table("Dominios");
            Id(x => x.Id);
            Map(x => x.Descricao);
            Map(x => x.Ativo);
        }
    }
}
