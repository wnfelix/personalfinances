﻿using FinancasPessoais.Domain;
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
            Map(x => x.Manual);
            References(x => x.Estabelecimento, "IdEstabelecimento").Fetch.Join();
            References(x => x.DescricaoExtra, "IdDescricaoExtra").Fetch.Join();
            References(x => x.ClassificacaoExtra, "IdClassificacaoExtra").Fetch.Join();
            References(x => x.Classificacao, "IdClassificacao").Fetch.Join();
        }
    }
}
