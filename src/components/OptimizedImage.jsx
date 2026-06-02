/**
 * OptimizedImage
 *
 * Drop-in <img> wrapper that handles:
 *   - Native lazy loading (loading="lazy") with above-the-fold override via `priority`
 *   - fetchpriority="high" for LCP images
 *   - Explicit width/height to prevent layout shift (CLS)
 *   - decoding="async" so the main thread stays unblocked
 *
 * For srcset/WebP support, run your images through a build-time pipeline
 * (e.g. vite-imagetools) and pass the generated srcset string via the
 * `srcSet` prop.
 *
 * Props:
 *   src        – image URL (required)
 *   alt        – alt text (required)
 *   width      – intrinsic pixel width (required for CLS prevention)
 *   height     – intrinsic pixel height (required for CLS prevention)
 *   priority   – true for above-the-fold / LCP images (disables lazy loading)
 *   srcSet     – optional srcset string
 *   sizes      – optional sizes attribute (defaults to "100vw")
 *   className  – forwarded to <img>
 */
function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  srcSet,
  sizes = '100vw',
  className,
  ...rest
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      className={className}
      {...rest}
    />
  )
}

export default OptimizedImage
