using CommonHelpers.Constants;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using ExcelDocumentToolKit.CrossCutting.Infra.OpenXml;
using ExcelDocumentToolKit.CrossCutting.Infra.Parser;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FinancasPessoais.Services.Helper
{
    public class CreditCardOpenXmlApplication : OpenXmlApplication
    {
        public override void WriteExcelDocument<TObject>(string filePath, Dictionary<string, List<TObject>> lstObject)
        {
            if (File.Exists(filePath))
                File.Delete(filePath);

            var document = SpreadsheetDocument.Create(filePath, SpreadsheetDocumentType.Workbook);
            var workbookpart = document.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();
            var sheets = document.WorkbookPart.Workbook.AppendChild(new Sheets());

            UInt32 i = 1;
            foreach (var item in lstObject)
            {
                var worksheetPart = document.WorkbookPart.AddNewPart<WorksheetPart>();
                var sheetData = new SheetData();
                var sheetName = item.Key;
                worksheetPart.Worksheet = new Worksheet(sheetData);

                var data = new OpenXmlEntities.SLExcelData
                {
                    Headers = new List<string> { "Data", "Local", "Valor", "-", "Totais" },
                    SheetName = sheetName
                };

                var total = string.Empty;
                foreach (var itemRow in item.Value as List<DebitoData>)
                {

                    total += string.Concat("+", itemRow.Valor.ToString("0.00"));
                    total = string.Concat("=", total.Substring(1, total.Length - 1));

                    var row = new List<string> { itemRow.Data.ToString("dd/MM/yyyy"), itemRow.Local, itemRow.Valor.ToString(new System.Globalization.CultureInfo("en-US")), string.Empty, itemRow.Totais };
                    data.DataRows.Add(row.ToList());
                }
                data.DataRows.Add(new List<string> { "Total", string.Empty, total });

                #region Incluindo Sheet

                var sheet = new Sheet
                {
                    Id = document.WorkbookPart
                        .GetIdOfPart(worksheetPart),
                    SheetId = i++,
                    Name = sheetName
                };
                workbookpart.Workbook.LastChild.AppendChild(sheet);

                #endregion

                base.InsertSheetData(document, sheetData, data);
            }

            document.Close();
        }
        
        protected override Cell CreateTextCell(string header, uint index, string text, string formula)
        {
            var cell = new Cell { CellReference = header + index };
            //if (formula?.Length > 0)
            //{
            //    var cellFormula1 = new CellFormula { Text = text };
            //    var cellValue1 = new CellValue { Text = "0" };

            //    cell.Append(cellFormula1);
            //    cell.Append(cellValue1);

            //}
            if (header == "C" && index > 1 && decimal.TryParse(text, out decimal result))
            {
                var cellNumber = new CellValue();
                cellNumber.Text = text;

                cell.Append(cellNumber);
            }
            else
            {
                cell.DataType = CellValues.InlineString;

                var istring = new InlineString();
                var t = new Text { Text = text };
                istring.AppendChild(t);
                cell.AppendChild(istring);
            }

            return cell;
        }
    }
}
