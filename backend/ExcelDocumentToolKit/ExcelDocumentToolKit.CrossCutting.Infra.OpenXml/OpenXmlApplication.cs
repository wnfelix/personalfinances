using ExcelDocumentToolKit.Domain.IServices;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Collections.Generic;
using System.Linq;
using ExcelDocumentToolKit.CrossCutting.Infra.Parser;
using System;
using System.IO;
using DocumentFormat.OpenXml;
using System.Globalization;
using static ExcelDocumentToolKit.CrossCutting.Infra.OpenXml.OpenXmlEntities;

namespace ExcelDocumentToolKit.CrossCutting.Infra.OpenXml
{
    public class OpenXmlApplication : IExcelDocumentService
    {
        private SpreadsheetDocument OpenXmlExcelDocument { get; set; }
        private WorkbookPart workbookPart { get; set; }
        private IEnumerable<Sheet> Sheets { get; set; }
        private OpenXmlReader OpenXmlReader { get; set; }
        private OpenXmlWriter OpenXmlWriter { get; set; }
        private bool disposedValue;

        public OpenXmlApplication()
        {
        }

        public OpenXmlApplication(CultureInfo culture)
        {
            ObjectParser.SetCulture(culture);
        }

        public IExcelDocumentService OpenExcelDocument(string filePath)
        {
            OpenXmlExcelDocument = SpreadsheetDocument.Open(filePath, false);
            workbookPart = OpenXmlExcelDocument.WorkbookPart;
            Sheets = workbookPart.Workbook.Descendants<Sheet>();
            OpenXmlReader = new OpenXmlReader(workbookPart);

            return this;
        }

        public void CloseExcelDocument()
        {
            OpenXmlExcelDocument?.Close();
            OpenXmlExcelDocument = null;
        }

        public IEnumerable<TObject> ReadExcelDocument<TObject>(string sheetName) where TObject : class
        {
            List<string[]> propValue = null;
            var listReturn = new List<TObject>();

            var sheet = Sheets.FirstOrDefault(c => c.Name == sheetName);
            var openXmlExcelData = OpenXmlReader.ReadExcel(sheet);

            foreach (var row in openXmlExcelData.DataRows)
            {
                propValue = new List<string[]>();

                for (int i = 0; i < row.Count; i++)
                    if (i < openXmlExcelData.Headers.Count)
                        propValue.Add(new[] { openXmlExcelData.Headers[i].Replace(" ", ""), row[i] });

                if (row.Count() > 0)
                {
                    var TObjectInstance = Activator.CreateInstance<TObject>();
                    ObjectParser.FillInstance(TObjectInstance, propValue);
                    listReturn.Add(TObjectInstance);
                }
            }
            return listReturn;
        }

        /// <summary>
        /// Read Excel document by SheetIndex
        /// </summary>
        /// <typeparam name="TObject"></typeparam>
        /// <param name="sheetIndex">Zero based index sheet</param>
        /// <returns></returns>
        public IEnumerable<TObject> ReadExcelDocument<TObject>(int sheetIndex, bool usingPropertyAttribute = false) where TObject : class
        {
            List<string[]> propValue = null;
            var listReturn = new List<TObject>();

            var sheet = Sheets.Take(sheetIndex + 1).Last();
            var openXmlExcelData = OpenXmlReader.ReadExcel(sheet);

            foreach (var row in openXmlExcelData.DataRows)
            {
                propValue = new List<string[]>();

                for (int i = 0; i < row.Count; i++)
                    if (i < openXmlExcelData.Headers.Count)
                        propValue.Add(new[] { openXmlExcelData.Headers[i].Replace(" ", ""), row[i] });

                if (row.Count() > 0 && !row.All(r => string.IsNullOrEmpty(r)))
                {
                    var TObjectInstance = Activator.CreateInstance<TObject>();
                    ObjectParser.FillInstance(TObjectInstance, propValue);
                    listReturn.Add(TObjectInstance);
                }
            }
            return listReturn;
        }

        public virtual void WriteExcelDocument<TObject>(string filePath, Dictionary<string, List<TObject>> lstObject)
            where TObject : class
        {
            if (File.Exists(filePath))
                File.Delete(filePath);

            var document = SpreadsheetDocument.Create(filePath, SpreadsheetDocumentType.Workbook);
            var workbookpart = document.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();
            var sheets = document.WorkbookPart.Workbook.AppendChild(new Sheets());

            var headers = Activator.CreateInstance<TObject>().GetExcelHeaders();
            UInt32 i = 1;

            foreach (var item in lstObject)
            {
                var worksheetPart = document.WorkbookPart.AddNewPart<WorksheetPart>();
                var sheetData = new SheetData();
                var sheetName = item.Key;
                worksheetPart.Worksheet = new Worksheet(sheetData);

                var data = new OpenXmlEntities.SLExcelData
                {
                    Headers = headers.ToList(),
                    SheetName = sheetName
                };

                foreach (var itemRow in item.Value)
                {
                    var row = ObjectParser.FillExcelObject(itemRow);
                    data.DataRows.Add(row.ToList());
                }

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

                this.InsertSheetData(document, sheetData, data);
            }

            document.Close();
        }

        public void WriteExcelDocument<TObject>(IEnumerable<TObject> lstObject, string filePath, string sheetName) where TObject : class
        {
            var headers = Activator.CreateInstance<TObject>().GetExcelHeaders();
            var data = new OpenXmlEntities.SLExcelData
            {
                Headers = headers.ToList(),
                SheetName = sheetName
            };

            foreach (var item in lstObject)
            {
                var row = ObjectParser.FillExcelObject(item);
                data.DataRows.Add(row.ToList());
            }

            OpenXmlWriter.GenerateExcel(data, filePath);
        }

        public MemoryStream WriteExcelDocumentStream<TObject>(IEnumerable<TObject> lstObject, string sheetName, List<string> headers) where TObject : class
        {

            var data = new OpenXmlEntities.SLExcelData
            {
                Headers = headers.ToList(),
                SheetName = sheetName
            };

            foreach (var item in lstObject)
            {
                var row = ObjectParser.FillExcelObject(item);
                data.DataRows.Add(row.ToList());
            }

            return OpenXmlWriter.GenerateExcelStream(data);
        }

        public void WriteExcelDocument<TObject>(IEnumerable<TObject> lstObject, string filePath, string sheetName, List<string> headers) where TObject : class
        {
            var data = new OpenXmlEntities.SLExcelData
            {
                Headers = headers.ToList(),
                SheetName = sheetName
            };

            foreach (var item in lstObject)
            {
                var row = ObjectParser.GetValuesFromObject(item, headers);
                data.DataRows.Add(row.ToList());
            }

            OpenXmlWriter.GenerateExcel(data, filePath);
        }

        protected virtual void InsertSheetData(SpreadsheetDocument document, SheetData sheetData, SLExcelData data)
        {
            var worksheetPart = document.WorkbookPart.WorksheetParts.Last();

            // Add header
            UInt32 rowIdex = 0;
            var row = new Row { RowIndex = ++rowIdex };
            sheetData.AppendChild(row);
            var cellIdex = 0;

            foreach (var header in data.Headers)
            {
                row.AppendChild(CreateTextCell(ColumnLetter(cellIdex++),
                    rowIdex, header ?? string.Empty));
            }
            if (data.Headers.Count > 0)
            {
                // Add the column configuration if available
                if (data.ColumnConfigurations != null)
                {
                    var columns = (Columns)data.ColumnConfigurations.Clone();
                    worksheetPart.Worksheet
                        .InsertAfter(columns, worksheetPart
                        .Worksheet.SheetFormatProperties);
                }
            }

            // Add sheet data
            foreach (var rowData in data.DataRows)
            {
                cellIdex = 0;
                row = new Row { RowIndex = ++rowIdex };
                sheetData.AppendChild(row);
                foreach (var callData in rowData)
                {
                    var cell = CreateTextCell(ColumnLetter(cellIdex++), rowIdex, callData ?? string.Empty);
                    row.AppendChild(cell);
                }
            }

            document.WorkbookPart.Workbook.Save();
        }

        protected virtual Cell CreateTextCell(string header, UInt32 index, string text)
        {
            return CreateTextCell(header, index, text, string.Empty);
        }

        protected virtual Cell CreateTextCell(string header, UInt32 index, string text, string formula)
        {
            var cell = new Cell
            {
                DataType = CellValues.InlineString,
                CellReference = header + index
            };

            if (formula?.Length > 0)
            {
                var cellFormula1 = new CellFormula { Text = formula };
                var cellValue1 = new CellValue { Text = text };

                cell.Append(cellFormula1);
                cell.Append(cellValue1);
            }
            else
            {
                var istring = new InlineString();
                var t = new Text { Text = text };
                istring.AppendChild(t);
                cell.AppendChild(istring);
            }

            return cell;
        }

        protected virtual string ColumnLetter(int intCol)
        {
            var intFirstLetter = ((intCol) / 676) + 64;
            var intSecondLetter = ((intCol % 676) / 26) + 64;
            var intThirdLetter = (intCol % 26) + 65;

            var firstLetter = (intFirstLetter > 64)
                ? (char)intFirstLetter : ' ';
            var secondLetter = (intSecondLetter > 64)
                ? (char)intSecondLetter : ' ';
            var thirdLetter = (char)intThirdLetter;

            return string.Concat(firstLetter, secondLetter,
                thirdLetter).Trim();
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    OpenXmlReader?.Dispose();
                    OpenXmlExcelDocument?.Dispose();
                }

                disposedValue = true;
            }
        }

        ~OpenXmlApplication()
        {
            OpenXmlExcelDocument?.Close();
            Dispose(false);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

    }
}
