using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonHelpers.Base.Transformer
{
    public abstract class BaseTransformer<TSource, TTarget> : ITransformer<TSource, TTarget>
        where TSource : class, new()
        where TTarget : class, new()
    {
        public virtual TSource Reverse(TTarget target)
        {
            TSource returnValue = null;
            if (target != null)
                returnValue = TransformPrimitiveValues<TTarget, TSource>(target);

            return returnValue;
        }

        public virtual TTarget Transform(TSource source)
        {
            TTarget returnValue = null;
            if (source != null)
                returnValue = TransformPrimitiveValues<TSource, TTarget>(source);

            return returnValue;
        }

        /// <summary>
        /// Copia os valores de propriedades com mesmo nome e de tipos primitivos entre dois tipos.
        /// </summary>
        /// <typeparam name="S">Tipo origem</typeparam>
        /// <typeparam name="T">Tipo destino</typeparam>
        /// <param name="source">Origem de dados</param>
        /// <returns></returns>
        protected T TransformPrimitiveValues<S, T>(S source, params string[] exceptionProperties)
            where T : class, new()
        {
            var target = new T();
            CommonHelpers.ReflectionHelper.CopyPrimitiveValues(source, target, exceptionProperties);

            return target;
        }

        public virtual TTarget Transform(object entity)
        {
            throw new NotImplementedException();
        }

        public virtual TTarget Transform(TSource source, params object[] additionalInfo)
        {
            throw new NotImplementedException();
        }

        public virtual TSource Reverse(TTarget target, params object[] additionalInfo)
        {
            throw new NotImplementedException();
        }

        public virtual TReturn Transform<TReturn>(TSource source, params object[] additionalInfo)
            where TReturn : class, new()
        {
            throw new NotImplementedException();
        }

        public virtual TReturn Transform<TEntity, TReturn>(TEntity source, params object[] additionalInfo)
            where TReturn : class, new()
        {
            throw new NotImplementedException();
        }
    }
}
