import { test, enforce, omitWhen } from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { URL_LENGTH } from '@bk/util';
import 'vest/enforce/isURL';

export function urlValidations(fieldName: string, url: unknown ) {

  stringValidations(fieldName, url, URL_LENGTH);

  omitWhen(url === '', () => {
    test(fieldName, 'url must start with https, assets or /', () => {
      const _url = url as string;
      enforce(_url.startsWith('https://') || _url.startsWith('assets') || _url.startsWith('/')).isTruthy();
    });

    test(fieldName, 'url must be valid', () => {
      enforce(url).isURL({
        protocols: ['https'],
        require_tld: false,
        require_protocol: false,
        require_host: false,
        require_port: false,
        require_valid_protocol: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        allow_fragments: false,
        allow_query_components: true,
        validate_length: true,
      });
    });
  });
}

// tbd: test for links into assets directory and non-https links
