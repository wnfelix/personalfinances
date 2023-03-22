using CommonHelpers.Base;
using ExcelDocumentToolKit.CrossCutting.Infra.OpenXml;
using ExcelDocumentToolKit.Domain.IServices;
using FinancasPessoais.Console.Sessions;
using FinancasPessoais.Data.Repositories;
using FinancasPessoais.Domain;
using FinancasPessoais.Services;
using FinancasPessoais.Services.Helper;
using SimpleInjector;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Console
{
    class Program
    {
        static readonly Container container;

        static Program()
        {
            // 1. Create a new Simple Injector container
            container = new Container();

            // 2. Configure the container (register)
            container.Register<IFinancasPessoaisSession, FinancasPessoaisSession>();
            //container.Register<IExcelDocumentService, CreditCardOpenXmlApplication>(Lifestyle.Scoped);
            container.Register<IDominioRepository, DominioRepository>();
            container.Register<IExportToCsvCommandService, ExportToCsvCommandService>();
            container.Register<IExportToExcelCommandService>(() => new ExportToExcelCommandService((IDominioRepository)container.GetInstance(typeof(IDominioRepository)), new CreditCardOpenXmlApplication()));
            //container.Register<IExcelDocumentService, OpenXmlApplication>(Lifestyle.Scoped);

            // 3. Verify your configuration
            container.Verify();
        }

        static void Main(string[] args)
        {
            // 4. Use the container
            var repo = container.GetInstance<IExportToExcelCommandService>();

            System.Console.WriteLine("Iniciando processamento de arquivo");

            try
            {
                if(ValidateArgs(args))
                    repo.ExportExcel(args[0], @"c:\temp\caixa.xlsx", DateTime.Parse(args[1]));
            }
            catch (Exception e)
            {
                System.Console.WriteLine($"Erro: {e.Message}");
            }
            finally
            {
                System.Console.WriteLine("Processo de leitura finalizado");
                System.Console.ReadLine();
            }
            //Array.ForEach(arquivos.ToArray(), a => a.Value.AppendLine($"Total;;=SOMA(C2:C{a.Value.ToString().Split(new string[] { "\r\n" }, StringSplitOptions.RemoveEmptyEntries).Count()})"));
        }

        static bool ValidateArgs(string[] args)
        {
            var validArgs = false;

            if (args.Count() < 2 || string.IsNullOrEmpty(args[0]))
                System.Console.WriteLine("Informe o endereço do arquivo excel e a data de referência");
            else if(!DateTime.TryParse(args[1],out DateTime dtref))
                System.Console.WriteLine("Informe uma data de referência válida no segundo argumento");
            else if (!File.Exists(args[0]))
                System.Console.WriteLine("O arquivo especificado não existe");
            else
                validArgs = true;

            return validArgs;
        }
    }
}
