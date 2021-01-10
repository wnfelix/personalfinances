using System;
using System.Collections.Generic;

namespace ExcelDocumentToolKit.Domain.IServices
{
    public interface IOpenXmlApplication : IDisposable
    {
        void OpenExcelDocument(string filePath);
        IEnumerable<TObject> ReadExcelDocument<TObject>(string sheetName) where TObject : class;
        void WriteExcelDocument<TObject>(IEnumerable<TObject> lstObject, string filePath) where TObject : class;
    }
}
