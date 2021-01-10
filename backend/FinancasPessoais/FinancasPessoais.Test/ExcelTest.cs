using System;
using System.Collections.Generic;
using System.IO;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ExcelDocumentToolKit.CrossCutting.Infra.Attributes;
using ExcelDocumentToolKit.CrossCutting.Infra.OpenXml;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace FinancasPessoais.Test
{
    [TestClass]
    public class ExcelTest
    {
        [TestMethod]
        public void TestMethod1()
        {
            var app = new OpenXmlApplication();

            var dic = new Dictionary<string, List<TesteClass>>
            {
                { "serviços", new List<TesteClass> { new TesteClass { Nome = "will", Idade = 40 }, new TesteClass { Nome = "gi", Idade = 39 } } },
                { "saúde", new List<TesteClass> { new TesteClass { Nome = "joao", Idade = 20 }, new TesteClass { Nome = "maria", Idade = 21 }, new TesteClass { Nome = "carlos", Idade = 99 } } },
                { "contas a pagar", new List<TesteClass> { new TesteClass { Nome = "jas", Idade = 20 }, new TesteClass { Nome = "josé", Idade = 21 }, new TesteClass { Nome = "não sei", Idade = 99 } } }
            };

            app.WriteExcelDocument(@"c:\tmp\will.xlsx", dic);
        }

        private class TesteClass
        {
            [ExcelColumn(ColumnTitle = "Candidato")]
            public string Nome { get; set; }

            [ExcelColumn(ColumnTitle = "Contagem")]
            public int Idade { get; set; }
        }

    }
}
