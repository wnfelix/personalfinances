using CommonHelpers.Extensions;
using ExcelDocumentToolKit.CrossCutting.Infra.OpenXml;
using FinancasPessoais.Data.Repositories;
using FinancasPessoais.Domain;
using FinancasPessoais.Services.Helper;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace FinancasPessoais.Services
{
    public class ExportToCsvCommandService : IExportToCsvCommandService
    {
        private IDominioRepository _dominioRepository;

        public ExportToCsvCommandService(IDominioRepository dominioRepository)
        {
            _dominioRepository = dominioRepository;
        }

        public void ExportExcel(string filePath)
        {
            var excelApp = new OpenXmlApplication(); //container.GetInstance<IExcelDocumentService>();
            var dados = excelApp.OpenExcelDocument(filePath).ReadExcelDocument<DebitoData>(0, true);
            var minDate = dados.Select(d => d.Data).Min();
            var lstEstabelecimentos = _dominioRepository.List<Estabelecimento>();
            var extraDatas = _dominioRepository.FindBy<ClassificacaoExtra>(x => x.DataInicio >= minDate);

            var arquivos = new Dictionary<string, CSVFile>();

            DeleteFolderCSVFiles(filePath);

            foreach (var item in dados)
            {
                var extraData = extraDatas.Where(x => x.DataInicio <= item.Data && x.DataFim >= item.Data).FirstOrDefault();
                var estab = lstEstabelecimentos.FirstOrDefault(e => Regex.IsMatch(item.Local.Replace("*", string.Empty).ToUpper(), e.PalavraChave.ToUpper().LikeToRegular()));

                if (extraData != null)
                    item.Local = string.Concat(extraData.Prefixo, item.Local);

                if (estab == null)
                    estab = new Estabelecimento { Classificacao = extraData != null ? extraData.Classificacao : new TipoDominio { Descricao = "DESCONHECIDO" } };

                if (!arquivos.ContainsKey(estab.Classificacao.Descricao))
                {
                    var tmpSb = new CSVFile();

                    arquivos.Add(estab.Classificacao.Descricao, tmpSb);
                }

                var csvData = arquivos[estab.Classificacao.Descricao];
                csvData.AppendLine(item);
            }

            Array.ForEach(arquivos.ToArray(), a => a.Value.Save(Path.Combine(@"c:\tmp", string.Concat(a.Key, ".csv"))));
            excelApp.CloseExcelDocument();
        }

        private void DeleteFolderCSVFiles(string filePath)
        {
            foreach (var item in new FileInfo(filePath).Directory.GetFiles("*.csv"))
                File.Delete(item.FullName);
        }
    }
}
