using CommonHelpers.Base.Transformer;
using FinancasPessoais.Domain;
using FinancasPessoais.WebAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FinancasPessoais.WebAPI.Transformers
{
    public class LancamentoTransformer : BaseTransformer<Lancamento, LancamentoModel>
    {
        private ITransformer<ClassificacaoExtra, ClassificacaoExtraModel> _classificacaoExtraTransformer;
        private ITransformer<DescricaoExtra, DescricaoExtraModel> _descricaoExtraTransformer;

        public LancamentoTransformer(ITransformer<ClassificacaoExtra, ClassificacaoExtraModel> classificacaoExtraTransformer,
            ITransformer<DescricaoExtra, DescricaoExtraModel> descricaoExtraTransformer)
        {
            _classificacaoExtraTransformer = classificacaoExtraTransformer;
            _descricaoExtraTransformer = descricaoExtraTransformer;
        }

        public override LancamentoModel Transform(Lancamento source)
        {
            var target = base.Transform(source);

            target.ClassificacaoExtra = _classificacaoExtraTransformer.Transform(source.ClassificacaoExtra);
            target.DescricaoExtra = _descricaoExtraTransformer.Transform(source.DescricaoExtra);

            //if (source.DescricaoExtra != null)
            //    target.DescricaoExtra = new
            //    {
            //        source.DescricaoExtra.Id,
            //        Estabelecimento = new
            //        {
            //            source.DescricaoExtra.Estabelecimento.Id,
            //            source.DescricaoExtra.Estabelecimento.PalavraChave
            //        },
            //        source.DescricaoExtra.DataCompra
            //    };

            if (source.Estabelecimento != null)
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

            return target;
        }
    }
}