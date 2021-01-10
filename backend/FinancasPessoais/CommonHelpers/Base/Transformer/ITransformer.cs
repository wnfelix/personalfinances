using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonHelpers.Base.Transformer
{
    public interface ITransformer<TSource, TTarget>
        where TSource : class, new()
        where TTarget : class, new()
    {
        TTarget Transform(TSource source);

        TTarget Transform(TSource source, params object[] additionalInfo);

        TSource Reverse(TTarget source);

        TTarget Transform(object source);
    }
}
