using CommonHelpers.Extensions;
using FinancasPessoais.Data.Repositories;
using FinancasPessoais.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FinancasPessoais.Services.Extensions
{
    public static class DomainExtensions
    {
        public static void Classificar<TDomain, TDomainKey>(this Lancamento lanc, string local, DateTime data, decimal valor, DateTime dtRef, 
            Func<int> getIndexEstabDtRef,
            IRepository<TDomain, TDomainKey> repository)
        {
            const int idDesconhecido = 16;
            var item = new
            {
                Local = local,
                Data = data,
                Valor = valor
            };
            var tipoDesconhecido = repository.Get<TipoDominio>(idDesconhecido);
            var qtdEstab = new Dictionary<string, int>();
            var lstEstabelecimentos = repository.FindBy<Estabelecimento>(x => x.Ativo).OrderByDescending(e => e.PalavraChave.Length);
            var prefixos = repository.List<ClassificacaoExtra>();
            var estab = lstEstabelecimentos.FirstOrDefault(e => Regex.IsMatch(item.Local.Replace("*", string.Empty).ToUpper(), e.PalavraChave.ToUpper().LikeToRegular()));
            var prefixoExtra = prefixos.Where(x => x.DataInicio <= item.Data && x.DataFim >= item.Data).FirstOrDefault();
            DescricaoExtra descricaoExtra = null;
            lanc.Estabelecimento = estab;
            lanc.Descricao = item.Local;

            if (estab != null)
            {
                #region Mudando a classificação de uma compra específica na data

                var estabKey = $"{estab.Id}{item.Data}";
                if (!qtdEstab.ContainsKey(estabKey)) qtdEstab[estabKey] = 0;
                qtdEstab[estabKey] += 1;

                descricaoExtra = repository.FindBy<DescricaoExtra>(x => x.Ativo
                                                                                && x.DataCompra == item.Data
                                                                                && x.Estabelecimento.Id == estab.Id
                                                                                && qtdEstab[estabKey] >= x.IndiceCompraDe && qtdEstab[estabKey] <= x.IndiceCompraAte)
                                                                            .FirstOrDefault();

                if (descricaoExtra != null)
                {
                    lanc.Descricao = $"{descricaoExtra.Descricao}-{lanc.Descricao}";
                    estab = new Estabelecimento { Classificacao = descricaoExtra.Classificacao };
                }
                else
                    estab = new Estabelecimento { Classificacao = prefixoExtra != null ? prefixoExtra.Classificacao : tipoDesconhecido };

                #endregion
            }
            else
                estab = new Estabelecimento { Classificacao = prefixoExtra != null ? prefixoExtra.Classificacao : tipoDesconhecido };

            #region Adicionando prefixo por range de data

            if (prefixoExtra != null)
                lanc.Descricao = string.Concat(prefixoExtra.Prefixo, lanc.Descricao);

            #endregion

            lanc.Valor = item.Valor;
            //lanc.Descricao = item.Local;
            lanc.DtCompra = item.Data;
            lanc.DtReferencia = new DateTime(dtRef.Year, dtRef.Month, 1);
            lanc.DescricaoExtra = descricaoExtra;
            lanc.ClassificacaoExtra = prefixoExtra;
            lanc.CriadoEm = DateTime.Now;
        }
    }
}
