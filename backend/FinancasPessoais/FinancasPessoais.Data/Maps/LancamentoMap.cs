using FinancasPessoais.Domain;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Data.Maps
{
    public class LancamentoMap : ClassMap<Lancamento>
    {
        public LancamentoMap()
        {
            Id(x => x.Id).GeneratedBy.Identity();
            Map(x => x.Descricao);
            Map(x => x.DtCompra);
            Map(x => x.DtReferencia);
            Map(x => x.Valor);
            Map(x => x.CriadoEm);
            References(x => x.Estabelecimento, "IdEstabelecimento").Nullable();
            References(x => x.DescricaoExtra, "IdDescricaoExtra").Nullable();
            References(x => x.ClassificacaoExtra, "IdClassificacaoExtra").Nullable();
        }
    }
}
