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

        public void ExportExcel(string filePathSource, string filePathTarget)
        {
            //var excelApp = new OpenXmlApplication(new System.Globalization.CultureInfo("en-US")); //container.GetInstance<IExcelDocumentService>();
            var dados = _excelDocumentService.OpenExcelDocument(filePathSource).ReadExcelDocument<DebitoData>(0, true);
            var minDate = dados.Select(d => d.Data).Min();
            var lstEstabelecimentos = _dominioRepository.List<Estabelecimento>().OrderByDescending(e => e.PalavraChave.Length);
            var extraDatas = _dominioRepository.FindBy<ClassificacaoExtra>(x => x.DataInicio >= minDate);

            var arquivos = new Dictionary<string, List<DebitoData>>();

            //DeleteFolderExcelFiles(filePath);

            foreach (var item in dados)
            {
                var extraData = extraDatas.Where(x => x.DataInicio <= item.Data && x.DataFim >= item.Data).FirstOrDefault();
                var estab = lstEstabelecimentos.FirstOrDefault(e => Regex.IsMatch(item.Local.Replace("*", string.Empty).ToUpper(), e.PalavraChave.ToUpper().LikeToRegular()));

                //item.Valor = Convert.ToDecimal(item.Valor, new CultureInfo("en-US")).ToString();

                if (extraData != null)
                    item.Local = string.Concat(extraData.Prefixo, item.Local);

                if (estab == null)
                    estab = new Estabelecimento { Classificacao = extraData != null ? extraData.Classificacao : new TipoDominio { Descricao = "DESCONHECIDO" } };

                if (!arquivos.ContainsKey(estab.Classificacao.Descricao))
                    arquivos.Add(estab.Classificacao.Descricao, new List<DebitoData> { new DebitoData { Local = item.Local, Data = item.Data, Valor = item.Valor } });
                else
                    arquivos[estab.Classificacao.Descricao].Add(new DebitoData { Local = item.Local, Data = item.Data, Valor = item.Valor });
            }

            //foreach (var item in arquivos)
            //{
            //    var total = string.Empty;
            //    foreach (var data in item.Value)
            //        total += string.Concat("+", data.Valor);

            //    total = string.Concat("=", total.Substring(1, total.Length - 1));

            //    item.Value.Add(new DebitoData { Data = DateTime.MinValue, Local = "-", Valor = total });
            //}
            //Array.ForEach(arquivos.ToArray(), a => a.Value.Save(Path.Combine(@"c:\tmp", string.Concat(a.Key, ".csv"))));
            //File.Delete(@"c:\tmp\will.xlsx");
            //var document = SpreadsheetDocument.Create(@"c:\tmp\will.xlsx", SpreadsheetDocumentType.Workbook);
            //var workbookpart = document.AddWorkbookPart();
            //workbookpart.Workbook = new Workbook();
            //var sheets = document.WorkbookPart.Workbook.AppendChild(new Sheets());

            _excelDocumentService.WriteExcelDocument(filePathTarget, arquivos);
            //excelApp.CloseExcelDocument();
        }

        private void DeleteFolderExcelFiles(string filePath)
        {
            foreach (var item in new FileInfo(filePath).Directory.GetFiles("*.csv"))
                File.Delete(item.FullName);
        }
    }
}
