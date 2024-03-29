﻿using CommonHelpers.Base.Transformer;
using CommonHelpers.Extensions;
using ExcelDocumentToolKit.CrossCutting.Infra.OpenXml;
using ExcelDocumentToolKit.Domain.IServices;
using FinancasPessoais.Data.Repositories;
using FinancasPessoais.Domain;
using FinancasPessoais.Services.Helper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FinancasPessoais.Services
{
    public class ExportToExcelCommandService : IExportToExcelCommandService
    {
        private IDominioRepository _dominioRepository;
        private IExcelDocumentService _excelDocumentService;

        public ExportToExcelCommandService(IDominioRepository dominioRepository,
            IExcelDocumentService excelDocumentService)
        {
            _dominioRepository = dominioRepository;
            _excelDocumentService = excelDocumentService;
        }

        public void ExportExcel(string filePathSource, string filePathTarget, DateTime dtRef)
        {
            const int idDesconhecido = 204;
            var getDescription = new Func<TipoDominio, string>(e => string.Concat(e.Id, "-", e.Descricao));
            var dados = _excelDocumentService.OpenExcelDocument(filePathSource).ReadExcelDocument<DebitoData>(0, true);
            var minDate = dados.Select(d => d.Data).Min();
            var lstEstabelecimentos = _dominioRepository.List<Estabelecimento>().OrderByDescending(e => e.PalavraChave.Length);
            var prefixos = _dominioRepository.FindBy<ClassificacaoExtra>(x => x.DataInicio >= minDate);
            var tipoDesconhecido = _dominioRepository.Get<TipoDominio>(idDesconhecido);

            var arquivos = new Dictionary<string, List<DebitoData>>();
            var lancamentos = new List<Lancamento>();
            var qtdEstab = new Dictionary<string, int>();

            foreach (var item in dados)
            {
                var estab = lstEstabelecimentos.FirstOrDefault(e => Regex.IsMatch(item.Local.Replace("*", string.Empty).ToUpper(), e.PalavraChave.ToUpper().LikeToRegular()));
                var prefixoExtra = prefixos.Where(x => x.DataInicio <= item.Data && x.DataFim >= item.Data).FirstOrDefault();
                DescricaoExtra descricaoExtra = null;
                var lanc = new Lancamento { Estabelecimento = estab };

                if (estab != null)
                {
                    #region Mudando a classificação de uma compra específica na data

                    var estabKey = $"{estab.Id}{item.Data}";
                    if (!qtdEstab.ContainsKey(estabKey)) qtdEstab[estabKey] = 0;
                    qtdEstab[estabKey] += 1;

                    //item.Valor = Convert.ToDecimal(item.Valor, new CultureInfo("en-US")).ToString();
                    descricaoExtra = _dominioRepository.FindBy<DescricaoExtra>(x => x.Ativo
                                                                                    && x.DataCompra == item.Data
                                                                                    && x.Estabelecimento.Id == estab.Id
                                                                                    && qtdEstab[estabKey] >= x.IndiceCompraDe && qtdEstab[estabKey] <= x.IndiceCompraAte)
                                                                                .FirstOrDefault();

                    if (descricaoExtra != null)
                    {
                        item.Local = $"{descricaoExtra.Descricao}-{item.Local}";
                        estab = new Estabelecimento { Classificacao = descricaoExtra.Classificacao };
                    }

                    #endregion
                }
                else
                    estab = new Estabelecimento { Classificacao = prefixoExtra != null ? prefixoExtra.Classificacao : tipoDesconhecido };

                #region Adicionando prefixo por range de data

                if (prefixoExtra != null)
                    item.Local = string.Concat(prefixoExtra.Prefixo, item.Local);

                #endregion


                if (!arquivos.ContainsKey(getDescription(estab.Classificacao)))
                    arquivos.Add(getDescription(estab.Classificacao), new List<DebitoData> { new DebitoData { Local = item.Local, Data = item.Data, Valor = item.Valor } });
                else
                    arquivos[getDescription(estab.Classificacao)].Add(new DebitoData { Local = item.Local, Data = item.Data, Valor = item.Valor });


                lanc.Valor = item.Valor;
                lanc.Descricao = item.Local;
                lanc.DtCompra = item.Data;
                lanc.DtReferencia = new DateTime(dtRef.Year, dtRef.Month, 1);
                lanc.DescricaoExtra = descricaoExtra;
                lanc.ClassificacaoExtra = prefixoExtra;
                lanc.CriadoEm = DateTime.Now;
                lancamentos.Add(lanc);
            }

            _excelDocumentService.WriteExcelDocument(filePathTarget, arquivos);
            _excelDocumentService.CloseExcelDocument();

            _dominioRepository.ApagarLancamentosPorDtRef(dtRef);
            _dominioRepository.Save(lancamentos.AsEnumerable());
        }

        public void ExportExcel(string filePathSource, string filePathTarget, string fileFromToPath)
        {
            const string unknowDescription = "DESCONHECIDO";
            var tmp = new List<string>(File.ReadAllLines(fileFromToPath));
            tmp.Add(string.Concat(unknowDescription, ';', unknowDescription));

            var cfgLines = tmp
                .Select(cfg => new { key = cfg.Split(';')[0], value = cfg.Split(';')[1] })
                .OrderByDescending(cfg => cfg.key.Length);

            var lstEstabelecimentos = new System.Collections.Specialized.StringDictionary();
            Array.ForEach(cfgLines.ToArray(), cfg => lstEstabelecimentos.Add(cfg.key, cfg.value));

            var dados = _excelDocumentService.OpenExcelDocument(filePathSource).ReadExcelDocument<DebitoData>(0, true);
            var arquivos = new Dictionary<string, List<DebitoData>>();

            foreach (var item in dados)
            {
                var estab = lstEstabelecimentos.Keys.Cast<string>().FirstOrDefault(e => Regex.IsMatch(item.Local.Replace("*", string.Empty).ToUpper(), e.ToUpper().LikeToRegular()));

                if (string.IsNullOrEmpty(estab))
                    estab = unknowDescription;

                if (!arquivos.ContainsKey(lstEstabelecimentos[estab]))
                    arquivos.Add(lstEstabelecimentos[estab], new List<DebitoData> { new DebitoData { Local = item.Local, Data = item.Data, Valor = item.Valor } });
                else
                    arquivos[lstEstabelecimentos[estab]].Add(new DebitoData { Local = item.Local, Data = item.Data, Valor = item.Valor });
            }

            var totals = new List<DebitoData>();
            foreach (var item in arquivos)
            {
                totals.Add(new DebitoData { Local = item.Key, Data = DateTime.Today, Valor = item.Value.Sum(x => x.Valor) });
            }

            arquivos.Add("TOTAIS", totals);

            _excelDocumentService.WriteExcelDocument(filePathTarget, arquivos);
            _excelDocumentService.CloseExcelDocument();
        }
    }
}
