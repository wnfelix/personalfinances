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

        TSource Reverse(TTarget target, params object[] additionalInfo);

        TReturn Transform<TReturn>(TSource source, params object[] additionalInfo) where TReturn : class, new();

        TReturn Transform<TEntity, TReturn>(TEntity source, params object[] additionalInfo) where TReturn : class, new();
    }
}
