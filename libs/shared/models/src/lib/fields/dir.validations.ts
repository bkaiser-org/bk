import { test, enforce, omitWhen } from 'vest';
import { stringValidations } from '../primitive-validations/string.validations';
import { LONG_NAME_LENGTH } from '@bk/util';

export function dirValidations(fieldName: string, dir: unknown) {

  stringValidations(fieldName, dir, LONG_NAME_LENGTH);

  omitWhen(dir === '', () => {
    test(fieldName, 'validDirPathFormat', () => {
      enforce(dir).isURL({
        protocols: ['http', 'https', 'ftp'],
        require_tld: false,
        require_protocol: false,
        require_host: false,
        require_port: false,
        require_valid_protocol: false,
        allow_underscores: true,
        allow_trailing_dot: true,
        allow_protocol_relative_urls: true,
        allow_fragments: true,
        allow_query_components: false,
        validate_length: true,
      });    
    });
  });
}
