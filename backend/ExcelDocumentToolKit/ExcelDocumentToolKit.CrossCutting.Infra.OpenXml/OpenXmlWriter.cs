using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.IO;
using System.Linq;
using static ExcelDocumentToolKit.CrossCutting.Infra.OpenXml.OpenXmlEntities;

namespace ExcelDocumentToolKit.CrossCutting.Infra.OpenXml
{
    public class OpenXmlWriter
    {
        public WorkbookPart workbookPart { get; set; }
        public OpenXmlWriter(WorkbookPart workbookPart)
        {
            this.workbookPart = workbookPart;
        }

        private static string ColumnLetter(int intCol)
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

        private static Cell CreateTextCell(string header, UInt32 index, string text)
        {
            var cell = new Cell
            {
                DataType = CellValues.InlineString,
                CellReference = header + index
            };

            var istring = new InlineString();
            var t = new Text { Text = text };
            istring.AppendChild(t);
            cell.AppendChild(istring);
            return cell;
        }

        public static void InsertSheetData(SpreadsheetDocument document, SheetData sheetData, SLExcelData data)
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
                    var cell = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, callData ?? string.Empty);
                    row.AppendChild(cell);
                }
            }

            document.WorkbookPart.Workbook.Save();
        }

        public static void GenerateExcel(SLExcelData data, string filePath)
        {
            var document = SpreadsheetDocument.Create(filePath, SpreadsheetDocumentType.Workbook);

            var workbookpart = document.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();
            var worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
            var sheetData = new SheetData();

            worksheetPart.Worksheet = new Worksheet(sheetData);

            var sheets = document.WorkbookPart.Workbook.
                AppendChild<Sheets>(new Sheets());

            var sheet = new Sheet
            {
                Id = document.WorkbookPart
                .GetIdOfPart(worksheetPart),
                SheetId = 1,
                Name = data.SheetName ?? "Global"
            };
            sheets.AppendChild(sheet);

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
                    var cell = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, callData ?? string.Empty);
                    row.AppendChild(cell);
                }
            }

            workbookpart.Workbook.Save();
            document.Close();
        }

        public static MemoryStream GenerateExcelStream(SLExcelData data)
        {
            MemoryStream memoryStream = new MemoryStream();
            var document = SpreadsheetDocument.Create(memoryStream, SpreadsheetDocumentType.Workbook);

            var workbookpart = document.AddWorkbookPart();
            workbookpart.Workbook = new Workbook();
            var worksheetPart = workbookpart.AddNewPart<WorksheetPart>();
            var sheetData = new SheetData();

            worksheetPart.Worksheet = new Worksheet(sheetData);

            var sheets = document.WorkbookPart.Workbook.
                AppendChild<Sheets>(new Sheets());

            var sheet = new Sheet
            {
                Id = document.WorkbookPart
                .GetIdOfPart(worksheetPart),
                SheetId = 1,
                Name = data.SheetName ?? "Global"
            };
            sheets.AppendChild(sheet);

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
                    var cell = CreateTextCell(ColumnLetter(cellIdex++),
                        rowIdex, callData ?? string.Empty);
                    row.AppendChild(cell);
                }
            }

            workbookpart.Workbook.Save();
            document.Close();
            memoryStream.Seek(0, SeekOrigin.Begin);

            return memoryStream;
        }
    }
}
