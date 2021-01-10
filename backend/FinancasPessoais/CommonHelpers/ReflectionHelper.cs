using CommonHelpers.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonHelpers
{
    public static class ReflectionHelper
    {
        public static void CopyPrimitiveValues(object source, object target, params string[] exceptionProperties)
        {
            if (source != null && target != null)
            {
                var primitiveTypes = new List<string>(new GeneralConstants().PrimitiveTypes.AsEnumerable());
                var targetTypes = target.GetType().GetProperties();

                foreach (var item in source.GetType().GetProperties())
                    if (primitiveTypes.Contains(item.PropertyType.Name.ToUpper())
                        && targetTypes.Any(p => p.Name.ToUpper() == item.Name.ToUpper() && primitiveTypes.Contains(p.PropertyType.Name.ToUpper()))
                        && !exceptionProperties.Any(e => e.ToUpper() == item.Name.ToUpper()))
                        target.GetType().GetProperty(item.Name).SetValue(target, item.GetValue(source));
            }
        }

        public static TProp GetPropertyByType<TProp>(object source)
        {
            var prop = source.GetType().GetProperties().Where(p => p.GetType() == typeof(TProp)).FirstOrDefault();
            TProp returnValue = default(TProp);
            if (prop != null)
                returnValue = (TProp)prop.GetValue(source);

            return returnValue;
        }
    }
}
