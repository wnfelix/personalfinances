using System;
using System.Collections.Generic;

namespace ExcelDocumentToolKit.Domain.IServices
{
    public interface IExcelDocumentService : IDisposable
    {
        IExcelDocumentService OpenExcelDocument(string filePath);
        void CloseExcelDocument();
        IEnumerable<TObject> ReadExcelDocument<TObject>(string sheetName) where TObject : class;

        IEnumerable<TObject> ReadExcelDocument<TObject>(int sheetIndex, bool usingPropertyAttribute = false) where TObject : class;

        void WriteExcelDocument<TObject>(IEnumerable<TObject> lstObject, string filePath, string sheetName) where TObject : class;

        void WriteExcelDocument<TObject>(IEnumerable<TObject> lstObject, string filePath, string sheetName, List<string> headers) where TObject : class;

        void WriteExcelDocument<TObject>(string filePath, Dictionary<string, List<TObject>> lstObject) where TObject : class;
    }
}
