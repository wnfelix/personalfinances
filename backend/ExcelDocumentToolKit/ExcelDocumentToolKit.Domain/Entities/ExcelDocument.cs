using System;
using System.IO;

namespace ExcelDocumentToolKit.Domain.Entities
{
    public class ExcelDocument
    {
        public ExcelDocument(string filePath)
        {
            FileName = Path.GetFileName(filePath);
            FileExtension = Path.GetExtension(filePath);
            FilePath = filePath;
        }

        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string FileExtension { get; set; }       
    }
}