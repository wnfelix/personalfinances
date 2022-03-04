using FinancasPessoais.Data.Repositories;
using FinancasPessoais.Services;
using FinancasPessoais.Services.Helper;
using SimpleInjector;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.AutomizacaoGi
{
    class Program
    {
        static readonly Container container;

        static Program()
        {
            // 1. Create a new Simple Injector container
            container = new Container();

            // 2. Configure the container (register)
            container.Register<IExportToExcelCommandService>(() => new ExportToExcelCommandService(null, new CreditCardOpenXmlApplication()));
            //container.Register<IExcelDocumentService, OpenXmlApplication>(Lifestyle.Scoped);

            // 3. Verify your configuration
            container.Verify();
        }

        static void Main(string[] args)
        {
            // 4. Use the container
            var repo = container.GetInstance<IExportToExcelCommandService>();

            Console.WriteLine("Iniciando processamento de arquivo");

            try
            {
                if (ValidateArgs(args))
                    repo.ExportExcel(args[0], args[1], args[2]);
            }
            catch (Exception e)
            {
                Console.WriteLine($"Erro: {e.Message}");
            }
            finally
            {
                Console.WriteLine("Processo de leitura finalizado");
                Console.ReadLine();
            }
        }

        static bool ValidateArgs(string[] args)
        {
            var validArgs = false;

            if (args.Count() < 3 || string.IsNullOrEmpty(args[0]))
                Console.WriteLine("Informe o endereço do arquivo excel, o endereço de destino do processamento e o endereço do arquivo de configuração");
            else if (!File.Exists(args[0]))
                Console.WriteLine($"O arquivo de origem {args[0]} não existe");
            else if (!File.Exists(args[2]))
                Console.WriteLine($"O arquivo DE/PARA {args[2]} não existe");
            else
                validArgs = true;

            return validArgs;
        }
    }
}
