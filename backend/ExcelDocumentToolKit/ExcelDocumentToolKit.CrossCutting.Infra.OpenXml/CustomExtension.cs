using System.Collections.Generic;

namespace ExcelDocumentToolKit.CrossCutting.Infra.OpenXml
{
    public static class CustomExtension
    {
        public static List<string> GetExcelHeaders<TObject>(this TObject obj) where TObject : class
        {
            var lst = new List<string>();
            foreach (var prop in obj.GetType().GetProperties())
                lst.Add(prop.Name);
            return lst;
        }
    }
}
