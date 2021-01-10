/*
using System;
using System.Collections.Generic;
using ExcelDocumentToolKit.Domain.Entities;
using ExcelDocumentToolKit.Domain.IServices;
using System.IO;

namespace ExcelDocumentToolKit.Domain.Services
{
    public class ExcelDocumentService : IExcelDocumentService
    {
        private readonly string _filePath;
        private bool disposedValue;
        private IOpenXmlApplication OpenXmlApplication { get; set; }        

        public ExcelDocumentService(string filePath, IOpenXmlApplication openXmlApplication)
        {
            _filePath = filePath;
            OpenXmlApplication = openXmlApplication;
        }

        public void OpenExcelDocument(string filePath)
        {
            OpenXmlApplication.OpenExcelDocument(_filePath);
        }

        public IEnumerable<TObject> ReadExcelDocument<TObject>(string sheetName) where TObject : class
        {
            OpenXmlApplication.OpenExcelDocument(_filePath);
            return OpenXmlApplication.ReadExcelDocument<TObject>(sheetName);
        }
        public void WriteExcelDocument<TObject>(IEnumerable<TObject> lstObject, string filePath) where TObject : class
        {
            OpenXmlApplication.WriteExcelDocument(lstObject, filePath);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    OpenXmlApplication.Dispose();
                }
                disposedValue = true;
            }
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

    }
}
*/