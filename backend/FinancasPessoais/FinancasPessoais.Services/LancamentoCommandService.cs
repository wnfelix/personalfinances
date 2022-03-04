using CommonHelpers.Extensions;
using ExcelDocumentToolKit.Domain.IServices;
using FinancasPessoais.Data.Repositories;
using FinancasPessoais.Domain;
using FinancasPessoais.Services.Helper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;

namespace FinancasPessoais.Services
{
    public class LancamentoCommandService : ILancamentoCommandService
    {
        private IDominioRepository _dominioRepository;
        private IExcelDocumentService _excelDocumentService;

        public LancamentoCommandService(IDominioRepository dominioRepository)
        {
            _dominioRepository = dominioRepository;
            _excelDocumentService = new CreditCardOpenXmlApplication();
        }

        public string ExportExcel(DateTime dtRef)
        {
            var getDescription = new Func<TipoDominio, string>(e => string.Concat(e.Id, "-", e.Descricao));
            var arquivos = new Dictionary<string, List<DebitoData>>();    
            var filePathTarget = Path.GetTempFileName();
            
            var lancs = _dominioRepository.FindBy<Lancamento>(l => l.DtReferencia == dtRef)
                .GroupBy(l => string.Concat(getDescription(l.GetClassificacaoFinal())));
            Array.ForEach(lancs.ToArray(), l => arquivos.Add(l.Key, l.Select(d => new DebitoData { Data = d.DtCompra, Local = d.Descricao, Valor = d.Valor }).ToList()));

            _excelDocumentService.WriteExcelDocument(filePathTarget, arquivos);
            _excelDocumentService.CloseExcelDocument();

            return filePathTarget;
        }

        public string ExportExcel(string[] filePathSource, DateTime dtRef)
        {
            const int idDesconhecido = 204;
            var getDescription = new Func<TipoDominio, string>(e => string.Concat(e.Id, "-", e.Descricao));
            var lstEstabelecimentos = _dominioRepository.List<Estabelecimento>().OrderByDescending(e => e.PalavraChave.Length);
            var tipoDesconhecido = _dominioRepository.Get<TipoDominio>(idDesconhecido);
            var arquivos = new Dictionary<string, List<DebitoData>>();
            var lancamentos = new List<Lancamento>();
            var qtdEstab = new Dictionary<string, int>();
            var filePathTarget = Path.GetTempFileName();

            foreach (var filePath in filePathSource)
            {
                var dados = _excelDocumentService.OpenExcelDocument(filePath).ReadExcelDocument<DebitoData>(0, true);
                var minDate = dados.Select(d => d.Data).Min();
                var prefixos = _dominioRepository.FindBy<ClassificacaoExtra>(x => x.DataInicio >= minDate);

                foreach (var item in dados)
                {
                    var estab = lstEstabelecimentos.FirstOrDefault(e => Regex.IsMatch(item.Local.Replace("*", string.Empty).ToUpper(), e.PalavraChave.ToUpper().LikeToRegular()));
                    var prefixoExtra = prefixos.Where(x => x.DataInicio <= item.Data && x.DataFim >= item.Data).FirstOrDefault();
                    DescricaoExtra descricaoExtra = null;
                    var lanc = new Lancamento { Estabelecimento = estab };

                    if (estab != null && prefixoExtra == null)
                    {
                        #region Mudando a classificação de uma compra específica na data

                        var estabKey = $"{estab.Id}{item.Data}";
                        if (!qtdEstab.ContainsKey(estabKey)) qtdEstab[estabKey] = 0;
                        qtdEstab[estabKey] += 1;

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
            }

            _excelDocumentService.WriteExcelDocument(filePathTarget, arquivos);
            _excelDocumentService.CloseExcelDocument();

            _dominioRepository.ApagarLancamentosPorDtRef(dtRef);
            _dominioRepository.Save(lancamentos.AsEnumerable());
            //excelApp.CloseExcelDocument();

            return filePathTarget;
        }

        public List<Lancamento> Lancamentos(DateTime mesref)
        {
            return (from l in _dominioRepository.GetQueryable<Lancamento>()
                    where l.DtReferencia.Year == mesref.Year && l.DtReferencia.Month == mesref.Month
                    select l).ToList();
        }

        public Lancamento Incluir(Lancamento lancamento)
        {
            lancamento.Estabelecimento = lancamento.Estabelecimento?.Id > 0 ? _dominioRepository.Get<Estabelecimento>(lancamento.Estabelecimento.Id) : null;
            lancamento.Classificacao = lancamento.Classificacao?.Id > 0 ? _dominioRepository.Get<TipoDominio>(lancamento.Classificacao?.Id) : null;
            lancamento.DtReferencia = new DateTime(lancamento.DtCompra.Year, lancamento.DtCompra.Month, 1);
            lancamento.CriadoEm = DateTime.Now;

            _dominioRepository.Save(lancamento);

            return lancamento;
        }
    }
}
