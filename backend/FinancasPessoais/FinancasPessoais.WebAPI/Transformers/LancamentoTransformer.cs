﻿using CommonHelpers.Base.Transformer;
using FinancasPessoais.Domain;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace FinancasPessoais.WebAPI.Transformers
{
    public class LancamentoTransformer : BaseTransformer<Lancamento, LancamentoModel>
    {
        private ITransformer<ClassificacaoExtra, ClassificacaoExtraModel> _classificacaoExtraTransformer;
        private ITransformer<DescricaoExtra, DescricaoExtraModel> _descricaoExtraTransformer;
        private ITransformer<TipoDominio, TipoDominioModel> _tipoDominioTransformer;

        public LancamentoTransformer(ITransformer<ClassificacaoExtra, ClassificacaoExtraModel> classificacaoExtraTransformer,
            ITransformer<DescricaoExtra, DescricaoExtraModel> descricaoExtraTransformer,
            ITransformer<TipoDominio, TipoDominioModel> tipoDominioTransformer)
        {
            _classificacaoExtraTransformer = classificacaoExtraTransformer;
            _descricaoExtraTransformer = descricaoExtraTransformer;
            _tipoDominioTransformer = tipoDominioTransformer;
        }

        public override LancamentoModel Transform(Lancamento source)
        {
            var target = base.Transform(source);
            const string defaultLabel = "DESCONHECIDO";

            target.ClassificacaoExtra = _classificacaoExtraTransformer.Transform(source.ClassificacaoExtra);
            target.DescricaoExtra = _descricaoExtraTransformer.Transform(source.DescricaoExtra);
            target.Classificacao = _tipoDominioTransformer.Transform(source.Classificacao);
            target.Reclassificado = source.DescricaoExtra != null && source.DescricaoExtra.Classificacao.Id != source.Estabelecimento.Id;
            target.Parcelado = Regex.IsMatch(source.Descricao, @"\d{1,2}/\d{1,2}");

            if (source.Estabelecimento != null)
            {
                target.Estabelecimento = new
                {
                    source.Estabelecimento.Id,
                    source.Estabelecimento.Descricao,
                    source.Estabelecimento.PalavraChave,
                    Classificacao = new
                    {
                        source.Estabelecimento.Classificacao.Id,
                        source.Estabelecimento.Classificacao.Descricao
                    }
                };
                target.Detalhe = source.Estabelecimento.Descricao;
            }
            else if (source.Classificacao == null)
            {
                target.Estabelecimento = new { Id = 0, Descricao = defaultLabel, Classificacao = new { Id = 0, Descricao = defaultLabel } };
            }

            target.ClassificacaoFinal = new { source.GetClassificacaoFinal().Id, source.GetClassificacaoFinal().Descricao };


            return target;
        }

        public override Lancamento Reverse(LancamentoModel source)
        {
            var target = base.Reverse(source);

            target.ClassificacaoExtra = _classificacaoExtraTransformer.Reverse(source.ClassificacaoExtra);
            target.DescricaoExtra = _descricaoExtraTransformer.Reverse(source.DescricaoExtra);
            if (source.Estabelecimento != null)
                target.Estabelecimento = new Estabelecimento { Id = source.Estabelecimento.id };
            if (source.Classificacao != null)
                target.Classificacao = new TipoDominio { Id = source.Classificacao.id };

            return target;
        }
    }
}