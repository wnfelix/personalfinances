using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CommonHelpers.Extensions
{
    public static class StringExtensions
    {
        public static string LikeToRegular(this string value)
        {
            return "^" + Regex.Escape(value.Replace("*", string.Empty)).Replace("_", ".").Replace("%", ".*") + "$";
        }
    }
}
