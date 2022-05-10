import classNames from 'classnames';
import * as Icons from 'react-feather';
import { nanoid } from 'nanoid';
import { useState, useEffect, useCallback } from 'react';

import Link from 'next/link';

// Normalize how we work with the subtext as an array[]
export function normalizeSubtext(subtext) {
  if (!Array.isArray(subtext)) {
    subtext = [subtext];
  }

  return subtext;
}

// Simple method to normalize string as slug
export function normalizeSlug(key) {
  return String(key.toLowerCase()).split(' ').join('-');
}

// For accessibility issues we can "fix" our limitations with markdown and remark-html
export function normalizeTextLayout(html) {
  return html
    .replace(/<(h[1-6])>/g, (m, p1) => {
      return `<div class="${p1}">`;
    })
    .replace(/<\/(h[1-6])>/g, (m, p1) => {
      return '</div>';
    });
}

// Normalize how we listen for media queries
// Intentionally `null` default value -- will throw Error
export function useMatchMedia(mediaQuery = null) {
  if (!mediaQuery) {
    throw new Error(`Jambonz UI "useMatchMedia" requires valid Media Query: ${mediaQuery} was passed.`);
  }

  const [mobile, setMobile] = useState(false);

  const handleMedia = useCallback((e) => {
    setMobile(e.matches);
  }, [setMobile]);

  useEffect(() => {
    const mql = window.matchMedia(mediaQuery);

    mql.addEventListener('change', handleMedia);

    setMobile(mql.matches);

    return function cleanup() {
      mql.removeEventListener('change', handleMedia);
    };
  }, [handleMedia, setMobile, mediaQuery]);

  return mobile;
}

// Normalize for our mobile media query
export function useMobileMedia() {
  return useMatchMedia('(max-width: 896px)');
}

export function H1({ children, ...rest }) {
  return <h1 {...rest}>{children}</h1>;
}

export function H2({ children, ...rest }) {
  return <h2 {...rest}>{children}</h2>;
}

export function H3({ children, ...rest }) {
  return <h3 {...rest}>{children}</h3>;
}

export function H4({ children, ...rest }) {
  return <h4 {...rest}>{children}</h4>;
}

export function H5({ children, ...rest }) {
  return <h5 {...rest}>{children}</h5>;
}

export function H6({ children, ...rest }) {
  return <h6 {...rest}>{children}</h6>;
}

export function P({ children, ...rest }) {
  return <p {...rest}>{children}</p>;
}

export function M({ children }) {
  return <div className="m">{children}</div>;
}

export function MS({ children }) {
  return <div className="ms">{children}</div>;
}

export function MXS({ children }) {
  return <div className="mxs">{children}</div>;
}

export function Latest({ data }) {
  const classes = {
    'latest': true,
    [`latest--${data.label}`]: true,
    'pad': true,
    'bg-pink': true,
  };

  return (
    <section className={classNames(classes)}>
      <div className="wrap latest__wrap">
        <div className="latest__headline">
          <H2>{data.headline}</H2>
        </div>
        <div className="latest__subtext">
          <H3 className="h5">
            {/* Use dangerouslySetInnerHTML to render inline links from YAML data */}
            {normalizeSubtext(data.subtext).map((subtext) => {
              return <div key={nanoid()} dangerouslySetInnerHTML={{ __html: subtext }} />;
            })}
          </H3>
        </div>
      </div>
    </section>
  );
}

export function Hero({ data, subStyle }) {
  const classes = {
    'hero': true,
    'pad': true,
  };

  if (subStyle) {
    classes[`hero--${subStyle}`] = true;
  }

  return (
    <section className={classNames(classes)}>
      <div className="wrap hero__wrap">
        <div className="hero__headline">
          <H1>{data.headline}</H1>
        </div>
        <div className="hero__subtext">
          <H2 className="h5">
            {normalizeSubtext(data.subtext).map((subtext) => {
              return <div key={nanoid()}>{subtext}</div>;
            })}
          </H2>
        </div>
        {data.cta && (
          <div className="hero__cta">
            <Button href={data.url} target="_blank">{data.cta}</Button>
          </div>
        )}
      </div>
    </section>
  );
}

// Extra {props} get passed to the <a> element
export function Button({ children, href, mainStyle = 'fill', subStyle = null, ...props }) {
  const classes = {
    'btn': true,
    [`btn--${mainStyle}`]: true,
  };

  if (subStyle) {
    classes[`btn--${mainStyle}--${subStyle}`] = true;
  }

  return (
    <Link href={href}>
      <a {...props} className={classNames(classes)}>{children}</a>
    </Link>
  );
}

// Extra {props} get passed to the feather Component
// See react-feather for all 286 icons available
// https://github.com/feathericons/react-feather
export function Icon({ name, mainStyle = 'inline', subStyle = null, ...props }) {
  const Component = Icons[name];
  const classes = {
    'icon': true,
    [`icon--${mainStyle}`]: true,
  };

  if (subStyle) {
    classes[`icon--${mainStyle}--${subStyle}`] = true;
  }

  if (!Component) {
    return null;
  }

  // Stylized icon
  if (mainStyle !== 'inline') {
    return (
      <div className={classNames(classes)}>
        <Component {...props} />
      </div>
    );
  }

  // Inline icon
  return <Component {...props} />;
}

export function TextLayout({ data, name }) {
  return (
    <div className={`text-layout text-layout--${name}`}>
      <div className="text-layout__wrap" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
    </div>
  );
}